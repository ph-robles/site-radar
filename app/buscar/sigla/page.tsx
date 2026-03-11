"use client";
 
import { useState } from "react";
import SiteCard from "@/components/SiteCard";
import type { SiteNear } from "@/components/ErbMap";
 
export default function BuscarSiglaPage() {
 
  const [query, setQuery] = useState("");
  const [sites, setSites] = useState<SiteNear[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  async function buscar() {
 
    if (!query.trim()) return;
 
    setLoading(true);
    setError(null);
 
    try {
 
      const res = await fetch(
        `/api/sites/search?sigla=${encodeURIComponent(query)}`
      );
 
      if (!res.ok) {
        throw new Error("Erro ao buscar sites");
      }
 
      const data = await res.json();
 
      setSites(data.sites || []);
 
    } catch (e: any) {
 
      setError(e.message);
 
    } finally {
 
      setLoading(false);
 
    }
  }
 
  return (
 
    <section className="max-w-4xl mx-auto py-10">
 
      <h1 className="text-2xl font-semibold mb-6">
        Buscar ERB por sigla
      </h1>
 
      <div className="flex gap-2 mb-6">
 
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite a sigla (ex: DJU)"
          className="border rounded px-3 py-2 w-full"
        />
 
        <button
          onClick={buscar}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
 
      </div>
 
      {loading && <p>Buscando...</p>}
 
      {error && (
        <p className="text-red-600">
          {error}
        </p>
      )}
 
      {sites.length === 0 && !loading && (
        <p className="text-gray-500">
          Nenhum site encontrado
        </p>
      )}
 
      <div className="grid gap-3">
 
        {sites.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
 
      </div>
 
    </section>
  );
}