"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import SiteCard from "@/components/SiteCard";
import type { SiteNear } from "@/components/ErbMap";

// Importa o mapa só no cliente (react-leaflet/leaflet não suportam SSR)
const ErbMap = dynamic(() => import("@/components/ErbMap"), { ssr: false });

export default function ClientContent() {
  const router = useRouter();
  const params = useSearchParams();

  const { latStr, lngStr } = useMemo(() => {
    return { latStr: params.get("lat"), lngStr: params.get("lng") };
  }, [params]);

  const nlat = latStr ? Number(latStr) : NaN;
  const nlng = lngStr ? Number(lngStr) : NaN;

  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<SiteNear[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSites = useCallback(async (lat: number, lng: number) => {
    const url = `/api/sites/near?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radius=5000`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Falha ao buscar ERBs próximas. HTTP ${res.status}`);
    const data = await res.json();
    setSites(Array.isArray(data.sites) ? data.sites : []);
  }, []);

  useEffect(() => {
    (async () => {
      if (!Number.isFinite(nlat) || !Number.isFinite(nlng)) {
        setLoading(false);
        return; // Sem coordenadas na URL → exibe o botão de detectar
      }
      try {
        await fetchSites(nlat, nlng);
      } catch (e: any) {
        setError(e?.message ?? "Erro ao buscar ERBs próximas.");
      } finally {
        setLoading(false);
      }
    })();
  }, [nlat, nlng, fetchSites]);

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
        router.replace(`/buscar/perto-de-mim?lat=${latitude}&lng=${longitude}`);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) setError("Permissão de localização negada.");
        else if (err.code === err.POSITION_UNAVAILABLE) setError("Localização indisponível.");
        else if (err.code === err.TIMEOUT) setError("Tempo esgotado ao obter localização.");
        else setError("Erro ao obter localização.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const userPoint = Number.isFinite(nlat) && Number.isFinite(nlng) ? { lat: nlat, lng: nlng } : null;

  return (
    <>
      {/* Se não tem coords na URL, oferecemos o botão de detectar */}
      {!userPoint && !loading && (
        <div className="mb-6 space-y-3">
          <p className="text-sm text-gray-700">
            Parece que você acessou esta página sem fornecer a sua localização.
          </p>
          <button
            onClick={detectarAqui}
            className="rounded-md bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700"
          >
            Detectar minha localização agora
          </button>
        </div>
      )}

      {loading && <p className="text-sm text-gray-600">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Mapa */}
      {userPoint && (
        <div className="mb-6">
          <ErbMap user={userPoint} sites={sites} className="h-80 rounded-lg overflow-hidden shadow" />
        </div>
      )}

      {/* Lista de resultados */}
      {!loading && !error && sites.length === 0 && userPoint && (
        <p className="text-sm text-gray-600">Nenhuma ERB encontrada neste raio.</p>
      )}

      <div className="mt-4 grid gap-3">
        {sites.map((s) => (
          <SiteCard key={s.id} site={s} />
        ))}
      </div>
    </>
  );
}
