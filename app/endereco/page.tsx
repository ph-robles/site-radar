'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { haversineKm } from '@/lib/geo';
import { isYes } from '@/lib/text';

type Site = {
  id: number;
  sigla: string;
  nome: string | null;
  detentora: string | null;
  endereco: string | null;
  lat: number | null;
  lon: number | null;
  capacitado: string | null; // texto: SIM/NÃO/...
};

type Row = Site & {
  dist_km: number;
  dist_rota_km?: number | null;
  tempo_min?: number | null;
  _is_capacitado?: boolean;
  _is_forced_cap?: boolean;
};

function ensureRJ(q: string) {
  // Se o usuário não informou cidade/UF, forçamos RJ como fallback
  const hasRJ = /(rio de janeiro| rj\b)/i.test(q);
  return hasRJ ? q : `${q}, Rio de Janeiro - RJ`;
}

export default function BuscarPorEndereco() {
  const [endereco, setEndereco] = useState('');
  const [status, setStatus] = useState<string>('');
  const [rows, setRows] = useState<Row[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [debug, setDebug] = useState<any>(null); // mostra último geocode p/ depuração

  async function geocodeSafe(query: string) {
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      try {
        return await res.json();
      } catch {
        return { ok: false, error: 'invalid json from /api/geocode' };
      }
    } catch {
      return { ok: false, error: 'fetch to /api/geocode failed' };
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q0 = endereco.trim();
    if (!q0) {
      setStatus('❌ Digite um endereço válido.');
      return;
    }

    setStatus('🔎 Localizando endereço...');
    setRows([]);
    setCoords(null);
    setDebug(null);

    // 1) Geocodificar — tenta como o usuário digitou; se falhar, tenta com fallback RJ
    let geo = await geocodeSafe(q0);
    if (!geo?.ok) {
      const qRJ = ensureRJ(q0);
      if (qRJ !== q0) {
        geo = await geocodeSafe(qRJ);
      }
    }

    setDebug(geo); // para você ver detalhes no console (F12)

    if (!geo?.ok) {
      console.warn('Geocode error:', geo);
      setStatus('❌ Não foi possível localizar o endereço informado (geocodificação). Tente incluir cidade/UF, ex.: "…, Rio de Janeiro - RJ".');
      return;
    }

    const lat_cli = Number(geo.lat);
    const lon_cli = Number(geo.lon);
    if (!Number.isFinite(lat_cli) || !Number.isFinite(lon_cli)) {
      setStatus('❌ Coordenadas inválidas retornadas pela geocodificação.');
      return;
    }

    setCoords({ lat: lat_cli, lon: lon_cli });
    setStatus(`Endereço encontrado: ${geo.display_name} — 🧭 ${lat_cli.toFixed(6)}, ${lon_cli.toFixed(6)}`);

    // 2) Buscar ERBs com lat/lon (não-nulos)
    const { data, error } = await supabase
      .from('sites')
      .select('id,sigla,nome,detentora,endereco,lat,lon,capacitado')
      .not('lat', 'is', null)
      .not('lon', 'is', null);

    if (error) {
      console.error('Supabase error:', error);
      setStatus('⚠ Erro ao carregar ERBs.');
      return;
    }
    if (!data || !data.length) {
      setStatus('⚠ Nenhuma ERB com coordenadas válidas no banco.');
      return;
    }

    // 2.1) Garantir que lat/lon são números válidos (filtra registros ruins)
    const parsed = data
      .map((r: any) => {
        const lat = typeof r.lat === 'string' ? Number(r.lat) : r.lat;
        const lon = typeof r.lon === 'string' ? Number(r.lon) : r.lon;
        return { ...r, lat, lon };
      })
      .filter((r: any) => Number.isFinite(r.lat) && Number.isFinite(r.lon));

    if (!parsed.length) {
      setStatus('⚠ Registros existem, mas todas as coordenadas são inválidas (verifique se usam ponto em vez de vírgula).');
      return;
    }

    // 3) Calcular distância reta (Haversine)
    let base: Row[] = parsed
      .map((r: any) => {
        const dist_km = haversineKm(lat_cli, lon_cli, Number(r.lat), Number(r.lon));
        return { ...r, dist_km, _is_capacitado: isYes(r.capacitado) };
      })
      .sort((a, b) => a.dist_km - b.dist_km);

    // 4) Regra: sempre incluir capacitado mais próximo (se houver)
    const somenteCaps = base.filter((r) => r._is_capacitado);
    let final: Row[] = [];
    if (somenteCaps.length) {
      const forced = { ...somenteCaps[0], _is_forced_cap: true };
      const restantes = base.filter((r) => r.id !== forced.id).slice(0, 2);
      final = [forced, ...restantes];
    } else {
      final = base.slice(0, 3).map((r) => ({ ...r, _is_forced_cap: false }));
    }

    // 5) Distância por rota e tempo (OSRM) — continua se falhar
    try {
      const osrmRes = await fetch('/api/osrm-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: { lat: lat_cli, lon: lon_cli },
          dests: final.map((r) => ({ lat: Number(r.lat), lon: Number(r.lon) })),
        }),
      });
      const js = await osrmRes.json();
      if (Array.isArray(js.rows) && js.rows.length === final.length) {
        final = final.map((r, i) => ({
          ...r,
          dist_rota_km: js.rows[i].distance_km ?? null,
          tempo_min: js.rows[i].duration_min ?? null,
        }));
      }
    } catch (err) {
      console.warn('OSRM error:', err);
      // fica só com linha reta mesmo
    }

    setRows(final);
  }

  return (
    <main style={{ maxWidth: 960, margin: '24px auto', padding: 16 }}>
      <h1>🧭 Buscar por ENDEREÇO</h1>

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Digite o endereço completo (rua, número, bairro, cidade/UF)"
          style={{ flex: 1, padding: '12px 14px', fontSize: 16, border: '1px solid #ccc', borderRadius: 8 }}
        />
        <button className="btn" style={{ width: 120 }} type="submit">OK</button>
      </form>

      {status && <p style={{ marginTop: 12 }}>{status}</p>}

      {/* Debug opcional: mostra JSON do geocode (apenas durante seus testes) */}
      {debug && (
        <details style={{ marginTop: 8 }}>
          <summary>🔧 Detalhes do geocode (debug)</summary>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(debug, null, 2)}</pre>
        </details>
      )}

      {rows.length > 0 && (
        <>
          <h3 style={{ marginTop: 16 }}>📌 Resultado (sempre inclui o capacitado mais próximo, se existir)</h3>

          {/* Tabela resumida */}
          <div style={{ overflowX: 'auto', border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 6 }}>SIGLA</th>
                  <th style={{ textAlign: 'left', padding: 6 }}>NOME</th>
                  <th style={{ textAlign: 'left', padding: 6 }}>DETENTORA</th>
                  <th style={{ textAlign: 'left', padding: 6 }}>ENDEREÇO</th>
                  <th style={{ textAlign: 'left', padding: 6 }}>CAPACITADO</th>
                  <th style={{ textAlign: 'right', padding: 6 }}>Linha reta (km)</th>
                  <th style={{ textAlign: 'right', padding: 6 }}>Rota (km)</th>
                  <th style={{ textAlign: 'right', padding: 6 }}>Tempo (min)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: 6 }}>{r.sigla}</td>
                    <td style={{ padding: 6 }}>{r.nome ?? '—'}</td>
                    <td style={{ padding: 6 }}>{r.detentora ?? '—'}</td>
                    <td style={{ padding: 6 }}>{r.endereco ?? '—'}</td>
                    <td style={{ padding: 6 }}>
                      {r._is_capacitado ? 'SIM' : 'NÃO'}
                      {r._is_forced_cap ? ' (Capacitado mais próximo)' : ''}
                    </td>
                    <td style={{ padding: 6, textAlign: 'right' }}>{r.dist_km.toFixed(3)}</td>
                    <td style={{ padding: 6, textAlign: 'right' }}>
                      {r.dist_rota_km != null ? r.dist_rota_km.toFixed(3) : '—'}
                    </td>
                    <td style={{ padding: 6, textAlign: 'right' }}>
                      {r.tempo_min != null ? r.tempo_min.toFixed(1) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cartões detalhados */}
          {rows.map((r) => {
            const maps = `https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lon}`;
            const rota = coords
              ? `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lon}&destination=${r.lat},${r.lon}&travelmode=driving`
              : '#';
            return (
              <div key={r.id} style={{ borderTop: '1px solid #eee', paddingTop: 12, marginTop: 12 }}>
                <h3>
                  {r.sigla} — {r.nome ?? '—'}
                  {r._is_capacitado && (
                    <span
                      style={{
                        display: 'inline-block',
                        marginLeft: 8,
                        padding: '2px 8px',
                        borderRadius: 9999,
                        fontSize: '.85rem',
                        fontWeight: 600,
                        color: '#0b5',
                        background: 'rgba(0,187,85,.12)',
                        border: '1px solid rgba(0,187,85,.35)',
                      }}
                    >
                      Capacitado
                    </span>
                  )}
                  {r._is_forced_cap && r._is_capacitado && (
                    <span
                      style={{
                        display: 'inline-block',
                        marginLeft: 8,
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontSize: '.78rem',
                        fontWeight: 600,
                        color: '#0057d9',
                        background: 'rgba(0,87,217,.08)',
                        border: '1px solid rgba(0,87,217,.18)',
                      }}
                    >
                      Capacitado mais próximo
                    </span>
                  )}
                </h3>

                <p>
                  🧭 <strong>Linha reta:</strong> {r.dist_km.toFixed(3)} km
                </p>
                <p>
                  🚗 <strong>Distância por rota:</strong>{' '}
                  {r.dist_rota_km != null ? `${r.dist_rota_km.toFixed(3)} km` : '—'}{' '}
                  &nbsp;&nbsp; ⏱ <strong>Tempo estimado:</strong>{' '}
                  {r.tempo_min != null ? `${r.tempo_min.toFixed(1)} min` : '—'}
                </p>

                <div style={{ display: 'flex', gap: 8 }}>
                  <a className="btn" style={{ width: 'auto', padding: '10px 16px' }} href={maps} target="_blank" rel="noreferrer">
                    🗺️ Ver no Maps
                  </a>
                  <a className="btn" style={{ width: 'auto', padding: '10px 16px' }} href={rota} target="_blank" rel="noreferrer">
                    🚗 Traçar rota
                  </a>
                </div>
              </div>
            );
          })}
        </>
      )}
    </main>
  );
}
