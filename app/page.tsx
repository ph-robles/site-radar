// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { searchSites, type Site } from '@/services/sites';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);
  const [results, setResults] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function run() {
      if (!debounced.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      const { data, error } = await searchSites(debounced);
      if (active) {
        if (error) {
          console.error('Erro ao buscar sites:', error);
          setResults([]);
        } else {
          setResults(data);
        }
        setLoading(false);
      }
    }

    run();
    return () => { active = false; };
  }, [debounced]);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Buscar Sites</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digite sigla ou nome..."
        className="w-full border rounded px-3 py-2"
      />

      {loading && <p className="mt-3 text-sm text-gray-500">Buscando...</p>}

      <ul className="mt-4 space-y-2">
        {results.map((s) => (
          <li key={s.id} className="border p-3 rounded">
            <div className="font-medium">{s.nome}</div>
            <div className="text-sm text-gray-600">{s.sigla}</div>
          </li>
        ))}
      </ul>

      {!loading && debounced && results.length === 0 && (
        <p className="mt-3 text-sm text-gray-500">Nada encontrado.</p>
      )}
    </main>
  );
}