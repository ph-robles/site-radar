"use client";
import { useState } from "react";
import SearchInput from "@/components/SearchInput";
import SiteCard from "@/components/SiteCard";

type Site = {
  id: number;
  sigla: string;
  nome: string | null;
  endereco: string | null;
  lat: number | null;
  lon: number | null;
};

export default function BuscarPorSiglaPage() {
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setError(null);
    if (!query) {
      setSites([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/by-sigla?query=${encodeURIComponent(query)}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Falha ao buscar por sigla.");
      const data = await res.json();
      setSites(data.sites ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Buscar por sigla</h2>
      <SearchInput placeholder="Ex.: RJO001" onSearch={handleSearch} />

      {loading && <p className="mt-4 text-sm text-gray-600">Carregando...</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {!loading && !error && sites.length === 0 && (
        <p className="mt-4 text-sm text-gray-600">Digite uma sigla para iniciar a busca.</p>
      )}

      <div className="mt-4 grid gap-3">
        {sites.map((s) => (
          <SiteCard key={s.id} site={s} />
        ))}
      </div>
    </section>
  );
}