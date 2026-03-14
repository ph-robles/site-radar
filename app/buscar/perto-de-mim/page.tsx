"use client";
 
import { Suspense, useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import SiteCard from "@/components/SiteCard";
import type { SiteNear } from "@/components/ErbMap";
 
const ErbMap = dynamic(() => import("@/components/ErbMap"), { ssr: false });
 
export default function PertoDeMimPage() {
  return (
    <section className="py-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">ERBs próximas</h2>
 
      <Suspense fallback={<p className="text-sm text-gray-600">Carregando…</p>}>
        <Inner />
      </Suspense>
    </section>
  );
}
 
function Inner() {
 
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
 
  // ranking
  const rankedSites = useMemo(() => {
    return [...sites].sort((a, b) => a.distancia_m - b.distancia_m);
  }, [sites]);
 
  const melhorSite = rankedSites.length > 0 ? rankedSites[0] : null;
 
  const fetchSites = useCallback(async (lat: number, lng: number) => {
 
    const url = `/api/sites/near?lat=${encodeURIComponent(
      lat
    )}&lng=${encodeURIComponent(lng)}&radius=5000`;
 
    const res = await fetch(url, { cache: "no-store" });
 
    if (!res.ok)
      throw new Error(`Falha ao buscar ERBs próximas. HTTP ${res.status}`);
 
    const data: { sites?: SiteNear[] } = await res.json();
 
    setSites(Array.isArray(data.sites) ? data.sites : []);
 
  }, []);
 
  useEffect(() => {
 
    (async () => {
 
      if (!Number.isFinite(nlat) || !Number.isFinite(nlng)) {
        setLoading(false);
        return;
      }
 
      try {
        await fetchSites(nlat, nlng);
      } catch (e: unknown) {
 
        const msg =
          e instanceof Error ? e.message : "Erro ao buscar ERBs próximas.";
 
        setError(msg);
 
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
 
        if (err.code === err.PERMISSION_DENIED)
          setError("Permissão de localização negada.");
        else if (err.code === err.POSITION_UNAVAILABLE)
          setError("Localização indisponível.");
        else if (err.code === err.TIMEOUT)
          setError("Tempo esgotado ao obter localização.");
        else setError("Erro ao obter localização.");
 
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };
 
  // copiar coordenadas
  const copiarCoordenadas = (lat: number, lon: number) => {
 
    const texto = `${lat},${lon}`;
 
    navigator.clipboard.writeText(texto);
 
    alert("Coordenadas copiadas: " + texto);
 
  };
 
  const userPoint =
    Number.isFinite(nlat) && Number.isFinite(nlng)
      ? { lat: nlat, lng: nlng }
      : null;
 
  return (
    <>
 
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
 
      {/* Melhor ERB */}
 
      {melhorSite && (
 
        <div className="mb-4 p-4 rounded-lg bg-green-100 border border-green-300">
 
          <h3 className="font-semibold text-green-800">
            📡 Melhor ERB para conexão
          </h3>
 
          <p className="text-sm">
            <strong>{melhorSite.sigla}</strong>
          </p>
 
          <p className="text-sm">
            distância: {Math.round(melhorSite.distancia_m)} metros
          </p>
 
          <p className="text-sm">
            capacitado: {melhorSite.capacitado}
          </p>
 
          <div className="flex gap-2 mt-3">
 
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${Number(
                melhorSite.lat
              )},${Number(melhorSite.lon)}`}
              target="_blank"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🧭 Navegar até a ERB
            </a>
 
            <button
              onClick={() =>
                copiarCoordenadas(Number(melhorSite.lat), Number(melhorSite.lon))
              }
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              📋 Copiar coordenadas
            </button>
 
          </div>
 
        </div>
 
      )}
 
      {userPoint && (
 
        <div className="mb-6">
 
          <ErbMap
            user={userPoint}
            sites={rankedSites}
            className="h-80 rounded-lg overflow-hidden shadow"
          />
 
        </div>
 
      )}
 
      {!loading && !error && rankedSites.length === 0 && userPoint && (
 
        <p className="text-sm text-gray-600">
          Nenhuma ERB encontrada neste raio.
        </p>
 
      )}
 
      {/* Ranking */}
 
      <div className="mt-4">
 
        <h3 className="text-lg font-semibold mb-2">
          📡 Ranking das ERBs mais próximas
        </h3>
 
        <div className="grid gap-3">
 
          {rankedSites.map((s, i) => (
 
            <div
              key={s.id}
              className="p-3 border rounded-lg bg-white shadow-sm"
            >
 
              <p className="text-sm font-semibold">
                #{i + 1} — {s.sigla}
              </p>
 
              <p className="text-xs text-gray-600">
                distância: {Math.round(s.distancia_m)} m
              </p>
 
              <p className="text-xs text-gray-600">
                capacitado: {s.capacitado}
              </p>
 
              <div className="flex gap-2 mt-2">
 
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${Number(
                    s.lat
                  )},${Number(s.lon)}`}
                  target="_blank"
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Navegar
                </a>
 
                <button
                  onClick={() =>
                    copiarCoordenadas(Number(s.lat), Number(s.lon))
                  }
                  className="text-xs bg-gray-700 text-white px-3 py-1 rounded"
                >
                  Copiar coordenadas
                </button>
 
              </div>
 
            </div>
 
          ))}
 
        </div>
 
      </div>
 
    </>
  );
}
 