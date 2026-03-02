import { NextResponse } from 'next/server';

// Cache em memória simples (apenas em dev) para evitar chamadas repetidas
// (reinicia a cada reload do servidor)
const memCache = new Map<string, { ts: number; payload: any }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

async function fetchNominatim(url: string, userAgent: string, tries = 3) {
  let lastErr: any = null;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'application/json'
        },
        cache: 'no-store',
      });

      // Se não for OK, ainda tentamos ler algum conteúdo
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        // Se for 429 (rate limit), espera e tenta de novo
        if (res.status === 429 && i < tries - 1) {
          await new Promise(r => setTimeout(r, 400 + i * 600));
          continue;
        }
        return { ok: false, error: `nominatim http ${res.status}`, detail: text?.slice(0, 300) ?? '' };
      }

      // Tenta JSON; se não der, pega texto
      try {
        const data = await res.json();
        return { ok: true, data };
      } catch {
        const text = await res.text().catch(() => '');
        return { ok: false, error: 'invalid json from nominatim', detail: text?.slice(0, 300) ?? '' };
      }
    } catch (err) {
      lastErr = err;
      // Espera um pouco e tenta de novo
      if (i < tries - 1) {
        await new Promise(r => setTimeout(r, 300 + i * 500));
      }
    }
  }
  return { ok: false, error: 'fetch failed', detail: String(lastErr || '') };
}

/**
 * /api/geocode?q=ENDERECO&proximity=-43.2,-22.9&country=br&limit=1
 * - q: texto do endereço (obrigatório)
 * - proximity: lon,lat (opcional) ajuda a "puxar" resultado para uma área
 * - country: restrição por país (opcional), padrão 'br'
 * - limit: número de resultados (string), padrão '1'
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    if (!q) {
      return NextResponse.json({ ok: false, error: 'missing q' }, { status: 200 });
    }

    const proximity = searchParams.get('proximity'); // lon,lat
    const country = (searchParams.get('country') || 'br').toLowerCase();
    const limit = searchParams.get('limit') || '1';

    // Monta URL do Nominatim
    const base = 'https://nominatim.openstreetmap.org/search';
    const url = new URL(base);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', limit);
    url.searchParams.set('q', q);
    if (country) url.searchParams.set('countrycodes', country);
    // Dá resultados mais completos
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('accept-language', 'pt-BR');

    // Nominatim não tem 'proximity' oficial como Mapbox, mas o texto de busca
    // pode ser influenciado incluindo cidade/estado. Ainda assim, manteremos o param
    // para um futuro uso ou heurísticas (sem efeito direto aqui).
    const proxOk = proximity && /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(proximity);

    // User-Agent — personalize com seu contato
    const userAgent = 'SiteRadar/1.0 (contato: seu-email@exemplo.com)';

    // Cache em memória: chave simples
    const cacheKey = `${q}|${country}|${limit}|${proxOk ? proximity : ''}`;
    const now = Date.now();
    const cached = memCache.get(cacheKey);
    if (cached && (now - cached.ts) < CACHE_TTL_MS) {
      return NextResponse.json(cached.payload, { status: 200 });
    }

    // Faz a chamada com retry/backoff
    const res = await fetchNominatim(url.toString(), userAgent, 3);
    if (!res.ok) {
      const payload = { ok: false, error: res.error, detail: res.detail ?? '' };
      memCache.set(cacheKey, { ts: now, payload });
      return NextResponse.json(payload, { status: 200 });
    }

    const arr = Array.isArray(res.data) ? res.data : [];
    if (arr.length === 0) {
      const payload = { ok: false, data: null };
      memCache.set(cacheKey, { ts: now, payload });
      return NextResponse.json(payload, { status: 200 });
    }

    // Pega o primeiro resultado
    const item = arr[0];
    const lat = Number(item.lat);
    const lon = Number(item.lon);
    const display_name = item.display_name || 'Endereço';

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      const payload = { ok: false, error: 'invalid coords' };
      memCache.set(cacheKey, { ts: now, payload });
      return NextResponse.json(payload, { status: 200 });
    }

    const payload = { ok: true, lat, lon, display_name };
    memCache.set(cacheKey, { ts: now, payload });
    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: 'route exception', detail: String(err?.message || err) },
      { status: 200 }
    );
  }
}