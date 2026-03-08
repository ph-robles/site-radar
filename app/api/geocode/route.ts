// app/api/geocode/route.ts
export const runtime = 'nodejs';

// 🚧 DEV APENAS: permita TLS inseguro se setado em env (NÃO USE EM PRODUÇÃO)
if (process.env.ALLOW_INSECURE_TLS === '1') {
  // eslint-disable-next-line no-process-env
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import { NextResponse } from 'next/server';

// Cache em memória simples (dev)
const memCache = new Map<string, { ts: number; payload: any }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min

async function fetchWithTimeout(url: string, opts: RequestInit & { timeoutMs?: number } = {}) {
  const { timeoutMs = 8000, ...rest } = opts;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...rest, signal: ctrl.signal, cache: 'no-store' });
    return res;
  } finally {
    clearTimeout(t);
  }
}

async function fetchNominatim(url: string, tries = 3) {
  // ⚠️ Troque para um e-mail seu real (política do Nominatim exige User-Agent identificável)
  const UA = 'SiteRadar/1.0 (contato: ph.robles33@gmail.com)';

  let lastErr: any = null;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetchWithTimeout(url, {
        headers: {
          'User-Agent': UA,
          'Accept': 'application/json',
        },
        timeoutMs: 8000 + i * 2000,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        // 429 = too many requests → tenta de novo com pequeno atraso
        if (res.status === 429 && i < tries - 1) {
          await new Promise(r => setTimeout(r, 500 + i * 800));
          continue;
        }
        return { ok: false, error: `nominatim http ${res.status}`, detail: text?.slice(0, 300) ?? '' };
      }

      try {
        const data = await res.json();
        return { ok: true, data };
      } catch {
        const text = await res.text().catch(() => '');
        return { ok: false, error: 'invalid json from nominatim', detail: text?.slice(0, 300) ?? '' };
      }
    } catch (err) {
      lastErr = err;
      if (i < tries - 1) {
        await new Promise(r => setTimeout(r, 600 + i * 900));
        continue;
      }
    }
  }
  return { ok: false, error: 'fetch failed', detail: String(lastErr || '') };
}

/**
 * GET /api/geocode?q=ENDERECO&country=br&limit=1
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    if (!q) {
      return NextResponse.json({ ok: false, error: 'missing q' }, { status: 200 });
    }

    const country = (searchParams.get('country') || 'br').toLowerCase();
    const limit = searchParams.get('limit') || '1';

    const base = 'https://nominatim.openstreetmap.org/search';
    const u = new URL(base);
    u.searchParams.set('format', 'json');
    u.searchParams.set('q', q);
    u.searchParams.set('limit', limit);
    u.searchParams.set('addressdetails', '1');
    u.searchParams.set('accept-language', 'pt-BR');
    if (country) u.searchParams.set('countrycodes', country);

    const key = `${q}|${country}|${limit}`;
    const now = Date.now();
    const cached = memCache.get(key);
    if (cached && now - cached.ts < CACHE_TTL_MS) {
      return NextResponse.json(cached.payload, { status: 200 });
    }

    const out = await fetchNominatim(u.toString(), 3);
    if (!out.ok) {
      const payload = { ok: false, error: out.error, detail: out.detail ?? '' };
      memCache.set(key, { ts: now, payload });
      return NextResponse.json(payload, { status: 200 });
    }

    const arr = Array.isArray(out.data) ? out.data : [];
    if (!arr.length) {
      const payload = { ok: false, data: null };
      memCache.set(key, { ts: now, payload });
      return NextResponse.json(payload, { status: 200 });
    }

    const item = arr[0];
    const lat = Number(item.lat);
    const lon = Number(item.lon);
    const display_name = item.display_name || 'Endereço';

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      const payload = { ok: false, error: 'invalid coords' };
      memCache.set(key, { ts: now, payload });
      return NextResponse.json(payload, { status: 200 });
    }

    const payload = { ok: true, lat, lon, display_name };
    memCache.set(key, { ts: now, payload });
    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: 'route exception', detail: String(err?.message || err) },
      { status: 200 }
    );
  }
}
