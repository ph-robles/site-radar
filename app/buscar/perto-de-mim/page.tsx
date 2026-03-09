"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function PertoDeMimPage() {
  const router = useRouter();
  const params = useSearchParams();

  const { lat, lng } = useMemo(() => {
    const la = params.get("lat");
    const ln = params.get("lng");
    return { lat: la, lng: ln };
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<SiteNear[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSites = async (nlat: number, nlng: number) => {
    const url = `/api/sites/near?lat=${encodeURIComponent(nlat)}&lng=${encodeURIComponent(nlng)}&radius=5000`;
    console.log("[Perto] Fetch:", url);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Falha ao buscar ERBs próximas. HTTP ${res.status}`);
    const data = await res.json();
    console.log("[Perto] Resposta:", data);
    setSites(data.sites ?? []);
  };

  useEffect(() => {
    (async () => {
      console.log("[Perto] Query params:", { lat, lng });
      if (!lat || !lng) {
        setLoading(false);
        return; // sem erro: vamos oferecer o botão de detectar abaixo
      }
      const nlat = Number(lat);
      const nlng = Number(lng);
      if (!Number.isFinite(nlat) || !Number.isFinite(nlng)) {
        setError("Parâmetros inválidos.");
        setLoading(false);
        return;
      }
      try {
        await fetchSites(nlat, nlng);
      } catch (e: any) {
        console.error("[Perto] Erro:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [lat, lng]);

  const detectarAqui = () => {
    setError(null);
    setLoading(true);
    if (!("geolocation" in navigator)) {
      setError("Geolocalização não é suportada neste navegador.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("[Perto] Detectado na página:", { latitude, longitude });
        router.replace(`/buscar/perto-de-mim?lat=${latitude}&lng=${longitude}`);
      },
      (err) => {
        console.warn("[Perto] Erro ao detectar:", err);
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) setError("Permissão de localização negada.");
        else if (err.code === err.POSITION_UNAVAILABLE) setError("Localização indisponível.");
        else if (err.code === err.TIMEOUT) setError("Tempo esgotado ao obter localização.");
        else setError("Erro ao obter localização.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <section className="py-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">ERBs próximas</h2>

      {loading && <p className="text-sm text-gray-600">Carregando...</p>}

      {!loading && !lat && !lng && (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Parece que você acessou esta página sem fornecer a localização.
          </p>
          <button
            onClick={detectarAqui}
            className="rounded-md bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700"
          >
            Detectar minha localização agora
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      {!loading && !error && sites.length === 0 && (lat && lng) && (
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