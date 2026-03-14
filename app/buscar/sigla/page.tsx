"use client";
 
import { useState, useEffect } from "react";
 
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
 
  const [query, setQuery] = useState("");
  const [sites, setSites] = useState<Site[]>([]);
  const [suggestions, setSuggestions] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
 
  function normalize(text: string) {
    return text
      .toUpperCase()
      .replace(/\s+/g, "")
      .replace(/^RJ/, "");
  }
 
  async function buscar(valor: string) {
 
    if (!valor) return;
 
    setLoading(true);
 
    try {
 
      const res = await fetch(
        `/api/sites/search?sigla=${encodeURIComponent(valor)}`
      );
 
      const data = await res.json();
 
      setSites(data.sites || []);
 
    } catch {
 
      alert("Erro ao buscar sites");
 
    }
 
    setLoading(false);
  }
 
  useEffect(() => {
 
    const delay = setTimeout(async () => {
 
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
 
      try {
 
        const res = await fetch(
          `/api/sites/search?sigla=${encodeURIComponent(normalize(query))}`
        );
 
        const data = await res.json();
 
        setSuggestions(data.sites.slice(0, 6));
 
      } catch {
 
        setSuggestions([]);
 
      }
 
    }, 250);
 
    return () => clearTimeout(delay);
 
  }, [query]);
 
  return (
 
    <section className="max-w-4xl mx-auto py-10">
 
      <h1 className="text-2xl font-semibold mb-6">
        📡 Buscar ERB por sigla
      </h1>
 
      {/* BUSCA */}
 
      <div className="relative flex gap-2 mb-8">
 
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite sigla ou nome da ERB"
          className="border rounded px-3 py-2 w-full"
        />
 
        <button
          onClick={() => buscar(normalize(query))}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
 
        {/* AUTOCOMPLETE */}
 
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
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex gap-2"
              >
 
                📡 <strong>{site.sigla}</strong>
 
                <span className="text-xs text-gray-500">
                  {site.nome}
                </span>
 
              </div>
 
            ))}
 
          </div>
 
        )}
 
      </div>
 
      {loading && <p>🔎 Buscando...</p>}
 
      {/* RESULTADOS */}
 
      <div className="grid gap-5">
 
        {sites.map((site) => (
 
          <div
            key={site.id}
            className="border rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition"
          >
 
            <h3 className="text-lg font-semibold mb-2">
              📡 {site.sigla}
            </h3>
 
            <p className="text-sm text-gray-700">
              🏢 <strong>Nome:</strong> {site.nome || "Não informado"}
            </p>
 
            <p className="text-sm text-gray-700">
              📶 <strong>Operadora:</strong> {site.detentora || "Não informado"}
            </p>
 
            <p className="text-sm text-gray-700">
              📍 <strong>Endereço:</strong> {site.endereco || "Não informado"}
            </p>
 
            <div className="mt-2">
 
              {site.capacitado === true || site.capacitado === "SIM" ? (
 
                <span className="text-green-700 font-medium">
                  ⚡ Capacitado
                </span>
 
              ) : (
 
                <span className="text-red-700 font-medium">
                  ❌ Não capacitado
                </span>
 
              )}
 
            </div>
 
            {/* BOTÕES */}
 
            <div className="flex gap-3 mt-4 flex-wrap">
 
              {/* VER NO GOOGLE MAPS */}
 
              <button
                onClick={() => {
 
                  if (!site.lat || !site.lon) {
                    alert("Coordenadas não disponíveis para esta ERB");
                    return;
                  }
 
                  const url =
                    `https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lon}`;
 
                  window.open(url, "_blank");
 
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                🗺 Ver no Google Maps
              </button>
 
              {/* ROTA */}
 
              <button
                onClick={() => {
 
                  if (!site.lat || !site.lon) {
                    alert("Coordenadas não disponíveis");
                    return;
                  }
 
                  const url =
                    `https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`;
 
                  window.open(url, "_blank");
 
                }}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                🚗 Rota até a ERB
              </button>
 
            </div>
 
          </div>
 
        ))}
 
      </div>
 
    </section>
  );
}
 