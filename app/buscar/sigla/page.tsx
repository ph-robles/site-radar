"use client";
 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
 
type Site = {
  id: number;
  sigla: string;
  nome: string;
  detentora: string;
  endereco: string;
  capacitado: boolean | string;
  lat: number | null;
  lon: number | null;
};
 
export default function BuscarSiglaPage() {
  const router = useRouter();
 
  const [query, setQuery] = useState("");
  const [sites, setSites] = useState<Site[]>([]);
  const [suggestions, setSuggestions] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
 
  function normalize(text: string) {
    return text.toUpperCase().replace(/\s+/g, "").replace(/^RJ/, "");
  }
 
  async function buscar(valor: string) {
    if (!valor) return;
    setLoading(true);
 
    const res = await fetch(
      `/api/sites/search?sigla=${encodeURIComponent(valor)}`
    );
 
    const data = await res.json();
 
    setSites(data.sites || []);
    setLoading(false);
  }
 
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
 
      const res = await fetch(
        `/api/sites/search?sigla=${encodeURIComponent(normalize(query))}`
      );
 
      const data = await res.json();
 
      setSuggestions(data.sites.slice(0, 6));
    }, 250);
 
    return () => clearTimeout(delay);
  }, [query]);
 
  return (
    <section className="max-w-4xl mx-auto py-10">
 
      <h1 className="text-2xl font-semibold mb-6">
        📡 Buscar ERB
      </h1>
 
      <div className="relative flex gap-2 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite sigla ou nome da ERB"
          className="border rounded px-3 py-2 w-full"
        />
 
        <button
          onClick={() => buscar(normalize(query))}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
 
        {suggestions.length > 0 && (
          <div className="absolute top-12 left-0 right-0 bg-white border rounded shadow z-10">
            {suggestions.map((site) => (
              <div
                key={site.id}
                onClick={() => {
                  setQuery(site.sigla);
                  setSuggestions([]);
                  buscar(site.sigla);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                📡 <strong>{site.sigla}</strong> — {site.nome}
              </div>
            ))}
          </div>
        )}
      </div>
 
      {loading && <p>Buscando...</p>}
 
      <div className="grid gap-4">
        {sites.map((site) => (
          <div
            key={site.id}
            className="border rounded-lg p-5 bg-white shadow-sm"
          >
            <h3 className="text-lg font-semibold">
              📡 {site.sigla}
            </h3>
 
            <p>🏢 {site.nome}</p>
            <p>📶 {site.detentora}</p>
            <p>📍 {site.endereco}</p>
 
            <div className="flex gap-3 mt-4 flex-wrap">
 
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lon}`,
                    "_blank"
                  )
                }
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                🗺 Ver no mapa
              </button>
 
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`,
                    "_blank"
                  )
                }
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                🚗 Rota
              </button>
 
              <button
                onClick={() => router.push(`/atualizar/${site.id}`)}
                className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
              >
                📝 Atualizar informações
              </button>
 
            </div>
          </div>
        ))}
      </div>
 
    </section>
  );
}
 