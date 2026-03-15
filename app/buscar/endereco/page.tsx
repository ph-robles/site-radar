"use client";
 
import { useState } from "react";
import SearchInput from "@/components/SearchInput";
 
type SiteNear = {
  id: number;
  sigla: string;
  nome: string | null;
  endereco: string | null;
  lat: number | null;
  lon: number | null;
  distancia_m: number;
  capacitado?: boolean;
};
 
export default function BuscarPorEnderecoPage() {
 
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<SiteNear[]>([]);
  const [error, setError] = useState<string | null>(null);
 
  const [resolved, setResolved] = useState<{
    lat: number;
    lng: number;
    label: string;
  } | null>(null);
 
  const handleSearch = async (address: string) => {
 
    setError(null);
    setSites([]);
    setResolved(null);
 
    if (!address) return;
 
    setLoading(true);
 
    try {
 
      const geoRes = await fetch(
        `/api/geocode?q=${encodeURIComponent(address)}`,
        { cache: "no-store" }
      );
 
      if (!geoRes.ok)
        throw new Error("Falha ao geocodificar o endereço.");
 
      const geo = await geoRes.json();
 
      if (!geo || !geo.lat || !geo.lng)
        throw new Error("Endereço não encontrado.");
 
      setResolved({
        lat: geo.lat,
        lng: geo.lng,
        label: geo.label,
      });
 
      const nearRes = await fetch(
        `/api/sites/near?lat=${geo.lat}&lng=${geo.lng}&radius=5000`,
        { cache: "no-store" }
      );
 
      if (!nearRes.ok)
        throw new Error("Falha ao buscar ERBs próximas.");
 
      const data = await nearRes.json();
 
      let results: SiteNear[] = data.sites ?? [];
 
      results.sort((a, b) => {
 
        if (a.capacitado && !b.capacitado) return -1;
        if (!a.capacitado && b.capacitado) return 1;
 
        return a.distancia_m - b.distancia_m;
 
      });
 
      results = results.slice(0, 3);
 
      setSites(results);
 
    } catch (e: any) {
 
      setError(e.message);
 
    } finally {
 
      setLoading(false);
 
    }
 
  };
 
  return (
 
    <section className="py-8 max-w-3xl mx-auto">
 
      <h2 className="text-2xl font-semibold mb-4">
        📍 Buscar ERB pelo endereço do cliente
      </h2>
 
      <SearchInput
        placeholder="Rua, número, bairro, cidade..."
        onSearch={handleSearch}
      />
 
      {resolved && (
 
        <p className="mt-3 text-sm text-gray-600">
 
          Endereço encontrado:
 
          <span className="font-medium ml-1">
            {resolved.label}
          </span>
 
        </p>
 
      )}
 
      {loading && (
        <p className="mt-4 text-sm text-gray-600">
          Buscando ERBs próximas...
        </p>
      )}
 
      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
 
      {!loading && !error && sites.length > 0 && (
 
        <div className="mt-6">
 
          <h3 className="text-lg font-semibold mb-3">
            📡 ERBs sugeridas
          </h3>
 
          <div className="grid gap-4">
 
            {sites.map((s, index) => (
 
              <div
                key={s.id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
 
                <div className="flex justify-between items-start">
 
                  <div>
 
                    <h4 className="font-semibold text-lg">
 
                      {index === 0 && "🥇 "}
                      {index === 1 && "🥈 "}
                      {index === 2 && "🥉 "}
 
                      {s.sigla}
 
                    </h4>
 
                    {s.nome && (
                      <p className="text-sm text-gray-600">
                        {s.nome}
                      </p>
                    )}
 
                    {s.endereco && (
                      <p className="text-sm text-gray-500">
                        📍 {s.endereco}
                      </p>
                    )}
 
                  </div>
 
                  <div className="text-right text-sm">
 
                    <p>
                      📏 {(s.distancia_m / 1000).toFixed(2)} km
                    </p>
 
                    {s.capacitado && (
                      <p className="text-green-600 font-medium">
                        ✔ Capacitada
                      </p>
                    )}
 
                  </div>
 
                </div>
 
                {/* BOTÕES */}
 
                {s.lat && s.lon && (
 
                  <div className="flex gap-3 mt-4">
 
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lon}`,
                          "_blank"
                        )
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      🗺 Ver no mapa
                    </button>
 
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}`,
                          "_blank"
                        )
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      🚗 Traçar rota
                    </button>
 
                  </div>
 
                )}
 
              </div>
 
            ))}
 
          </div>
 
        </div>
 
      )}
 
      {!loading && !error && sites.length === 0 && (
 
        <p className="mt-4 text-sm text-gray-600">
          Digite um endereço para iniciar.
        </p>
 
      )}
 
    </section>
 
  );
 
}

 