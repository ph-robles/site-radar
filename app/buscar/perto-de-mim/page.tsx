"use client";
import { useEffect, useState } from "react";
import SiteCard from "@/components/SiteCard";
import { useSearchParams } from "next/navigation";

type SiteNear = {
  id: number;
  sigla: string;
  nome: string | null;
  endereco: string | null;
  lat: number | null;
  lon: number | null;
  distancia_m: number;
};

export default function PertoDeMimPage() {
  const params = useSearchParams();
  const lat = params.get("lat");
  const lng = params.get("lng");

  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<SiteNear[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!lat || !lng) {
        setError("Coordenadas não fornecidas.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/sites/near?lat=${lat}&lng=${lng}&radius=5000`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Falha ao buscar ERBs próximas.");
        const data = await res.json();
        setSites(data.sites ?? []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [lat, lng]);

  return (
    <section className="py-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">ERBs próximas</h2>

      {loading && <p className="text-sm text-gray-600">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && sites.length === 0 && (
        <p className="text-sm text-gray-600">Nenhuma ERB encontrada neste raio.</p>
      )}

      <div className="mt-4 grid gap-3">
        {sites.map((s) => (
          <SiteCard key={s.id} site={s} />
        ))}
      </div>
    </section>
  );
}