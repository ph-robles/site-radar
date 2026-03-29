'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { normalizarSigla, levenshtein, formatCoord } from '@/lib/text';

type Site = {
  id: number;
  sigla: string;
  nome: string | null;
  detentora: string | null;
  endereco: string | null;
  lat: number | null;
  lon: number | null;
  capacitado: string | null;
};

export default function BuscarPorSigla() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSigla, setSelectedSigla] = useState<string | null>(null);
  const [sites, setSites] = useState<Site[]>([]);

  // Sugestões (debounce)
  useEffect(() => {
    const t = setTimeout(() => { void buildSuggestions(input); }, 200);
    return () => clearTimeout(t);
  }, [input]);

  async function buildSuggestions(raw: string) {
    const term = raw.trim();
    if (!term) { setSuggestions([]); return; }

    const limit = 50;
    const starts = await supabase.from('sites').select('sigla').ilike('sigla', `${term}%`).limit(limit);
    let pool = (starts.data || []).map((r: any) => String(r.sigla || '').toUpperCase());
    pool = Array.from(new Set(pool));

    if (pool.length < 8) {
      const contains = await supabase.from('sites').select('sigla').ilike('sigla', `%${term}%`).limit(limit);
      pool = Array.from(new Set([...pool, ...(contains.data || []).map((r: any) => String(r.sigla || '').toUpperCase())]));
    }

    const bnorm = normalizarSigla(term);
    const fuzzy: string[] = [];
    for (const s of pool) {
      const d = levenshtein(normalizarSigla(s), bnorm);
      if (d <= 1) fuzzy.push(s);
    }

    const begins = pool.filter(s => s.startsWith(term.toUpperCase()));
    const containsOnly = pool.filter(s => !begins.includes(s) && s.includes(term.toUpperCase()));
    setSuggestions(Array.from(new Set([...begins, ...containsOnly, ...fuzzy])).slice(0, 8));
  }

  async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    const busca = input.trim();
    if (!busca) return;

    setLoading(true);
    setSites([]);
    setSelectedSigla(null);

    // Candidatos
    const starts = await supabase.from('sites').select('sigla').ilike('sigla', `${busca}%`).limit(200);
    let candidatos = (starts.data || []).map((r: any) => String(r.sigla || ''));
    if (!candidatos.length) {
      const contains = await supabase.from('sites').select('sigla').ilike('sigla', `%${busca}%`).limit(200);
      candidatos = (contains.data || []).map((r: any) => String(r.sigla || ''));
    }
    candidatos = Array.from(new Set(candidatos.map(s => s.toUpperCase())));

    // Exato normalizado → senão fuzzy
    let achada: string | null = null;
    const buscaNorm = normalizarSigla(busca);
    for (const s of candidatos) {
      if (normalizarSigla(s) === buscaNorm) { achada = s; break; }
    }
    if (!achada && candidatos.length) {
      const scored = candidatos
        .map(s => ({ s, d: levenshtein(normalizarSigla(s), buscaNorm) }))
        .sort((a, b) => a.d - b.d || a.s.localeCompare(b.s));
      achada = scored[0].s;
    }

    if (!achada) { setLoading(false); alert('Nenhuma SIGLA compatível encontrada.'); return; }
    setSelectedSigla(achada);

    const detalhe = await supabase.from('sites').select('*').ilike('sigla', achada);
    setSites((detalhe.data || []) as any);
    setLoading(false);
  }

  function onSelectSuggestion(s: string) {
    setInput(s);
    setTimeout(() => void onSubmit(), 0);
  }

  const result = useMemo(() => {
    if (!selectedSigla) return null;
    return (
      <div>
        <div style={{ background: '#eaf6ff', border: '1px solid #cfe9ff', padding: '8px 12px', borderRadius: 8 }}>
          <strong>SIGLA encontrada:</strong> {selectedSigla}
        </div>

        <div style={{ marginTop: 16 }}>
          <h3>📍 Detalhes</h3>
          {sites.map((row) => (
            <div key={row.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0', marginBottom: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                {row.sigla || '—'}{row.nome ? ` — ${row.nome}` : ''}
              </div>
              <div>🏢 <strong>Detentora:</strong> {row.detentora || '—'}</div>
              <div>📌 <strong>Endereço:</strong> {row.endereco || '—'}</div>
              <div>🧰 <strong>Capacitado:</strong> {row.capacitado || '—'}</div>
              <div>🧭 <strong>Coordenadas:</strong> {formatCoord(row.lat)}, {formatCoord(row.lon)}</div>

              <div style={{ marginTop: 8 }}>
                {row.lat != null && row.lon != null ? (
                  <a className="btn" style={{ width: 'auto', display: 'inline-block', padding: '10px 16px' }}
                     href={`https://www.google.com/maps/search/?api=1&query=${row.lat},${row.lon}`}
                     target="_blank" rel="noreferrer">
                    🗺️ Ver no Google Maps
                  </a>
                ) : row.endereco ? (
                  <a className="btn" style={{ width: 'auto', display: 'inline-block', padding: '10px 16px' }}
                     href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row.endereco)}`}
                     target="_blank" rel="noreferrer">
                    🗺️ Ver no Google Maps (endereço)
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }, [selectedSigla, sites]);

  return (
    <main style={{ maxWidth: 960, margin: '24px auto', padding: 16 }}>
      <h1>🔍 Buscar por SIGLA</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite a SIGLA do site/ERB"
          style={{ flex: 1, padding: '12px 14px', fontSize: 16, border: '1px solid #ccc', borderRadius: 8 }}
        />
        <button className="btn" type="submit" style={{ width: 120 }}>OK</button>
      </form>

      {input.trim() && suggestions.length > 0 && (
        <>
          <h3 style={{ marginTop: 16 }}>🔎 Sugestões (clique para buscar)</h3>
          <div className="chips">
            {suggestions.map((s) => (
              <button key={s} className="chip" onClick={() => onSelectSuggestion(s)}>{s}</button>
            ))}
          </div>
        </>
      )}

      {loading && <p style={{ marginTop: 16 }}>Carregando…</p>}
      {!loading && !selectedSigla && input.trim() && suggestions.length === 0 && (
        <p style={{ marginTop: 16, color: '#555' }}>Nenhuma sugestão encontrada para a sigla digitada.</p>
      )}

      <div style={{ marginTop: 16 }}>
        {result}
      </div>

      {!selectedSigla && !loading && !input.trim() && (
        <p style={{ color: '#777', marginTop: 8 }}>
          Dica: digite parte da sigla e use as sugestões para agilizar a busca.
        </p>
      )}
    </main>
  );
}