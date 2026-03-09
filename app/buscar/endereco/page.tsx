"use client";
import { useState } from "react";
import SearchInput from "@/components/SearchInput";
import SiteCard from "@/components/SiteCard";

type SiteNear = {
  id: number;
  sigla: string;
  nome: string | null;
  endereco: string | null;
  lat: number | null;
  lon: number | null;
  distancia_m: number;
};

export default function BuscarPorEnderecoPage() {
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<SiteNear[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [resolved, setResolved] = useState<{ lat: number; lng: number; label: string } | null>(null);

  const handleSearch = async (address: string) => {
    setError(null);
    setSites([]);
    setResolved(null);

    if (!address) return;
    setLoading(true);
    try {
      // 1) Geocodifica o endereço
      const geoRes = await fetch(`/api/geocode?q=${encodeURIComponent(address)}`, { cache: "no-store" });
      if (!geoRes.ok) throw new Error("Falha ao geocodificar o endereço.");
      const geo = await geoRes.json();
      if (!geo || !geo.lat || !geo.lng) throw new Error("Endereço não encontrado.");

      setResolved({ lat: geo.lat, lng: geo.lng, label: geo.label });

      // 2) Busca ERBs próximas (raio padrão: 5000 m)
      const nearRes = await fetch(
        `/api/sites/near?lat=${geo.lat}&lng=${geo.lng}&radius=5000`,
        { cache: "no-store" }
      );
      if (!nearRes.ok) throw new Error("Falha ao buscar ERBs próximas.");
      const data = await nearRes.json();
      setSites(data.sites ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Buscar por endereço do cliente</h2>
      <SearchInput placeholder="Rua, número, bairro, cidade..." onSearch={handleSearch} />

      {resolved && (
        <p className="mt-3 text-sm text-gray-600">
          Endereço resolvido: <span className="font-medium">{resolved.label}</span> —{" "}
          {resolved.lat.toFixed(6)}, {resolved.lng.toFixed(6)}
        </p>
      )}

      {loading && <p className="mt-4 text-sm text-gray-600">Carregando...</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {!loading && !error && sites.length === 0 && (
        <p className="mt-4 text-sm text-gray-600">Digite um endereço para iniciar a busca.</p>
      )}

      <div className="mt-4 grid gap-3">
        {sites.map((s) => (
          <SiteCard key={s.id} site={s} />
        ))}
      </div>
    </section>
  );
}