"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type Site = {
  id: number;
  sigla: string;
  nome: string | null;
  endereco: string | null;
};

export default function SiglaPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Declare a função ANTES de usar no useEffect
  const buildSuggestions = useCallback(async (raw: string) => {
    const term = raw.trim().toUpperCase();
    if (!term) {
      setSuggestions([]);
      return;
    }

    try {
      // Exemplo: busca back-end de siglas e cria ranking simples
      const res = await fetch(`/api/sites/siglas?q=${encodeURIComponent(term)}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { siglas?: string[] } = await res.json();
      const all = Array.isArray(data.siglas) ? data.siglas : [];

      const begins = all.filter((s) => s.startsWith(term));
      const containsOnly = all.filter((s) => !s.startsWith(term) && s.includes(term));
      const fuzzy = all.filter((s) => !s.includes(term) && s.replace(/[^A-Z0-9]/g, "").includes(term));

      setSuggestions(Array.from(new Set([...begins, ...containsOnly, ...fuzzy])).slice(0, 8));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao sugerir siglas.";
      setError(msg);
    }
  }, []);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => {
      void buildSuggestions(input);
    }, 200);
    return () => clearTimeout(t);
  }, [input, buildSuggestions]);

  async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    const term = input.trim().toUpperCase();
    if (!term) return;
    router.push(`/buscar/sigla?sigla=${encodeURIComponent(term)}`);
  }

  return (
    <section className="py-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Buscar por Sigla</h2>

      <form onSubmit={onSubmit} className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite a sigla (ex.: ERB001)"
          className="border rounded px-3 py-2 flex-1"
        />
        <button className="rounded bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700">Buscar</button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {suggestions.length > 0 && (
        <ul className="list-disc ml-6 text-sm space-y-1">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                onClick={() => router.push(`/buscar/sigla?sigla=${encodeURIComponent(s)}`)}
                className="text-emerald-700 underline"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}