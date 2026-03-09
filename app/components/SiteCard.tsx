import { MapPin, Route } from "lucide-react";

type Site = {
  id: number;
  sigla: string;
  nome: string | null;
  endereco: string | null;
  lat: number | null;
  lon: number | null;
  distancia_m?: number; // opcional, quando vier da busca por proximidade
};

export default function SiteCard({ site }: { site: Site }) {
  const distance =
    typeof site.distancia_m === "number"
      ? site.distancia_m < 1000
        ? `${site.distancia_m.toFixed(0)} m`
        : `${(site.distancia_m / 1000).toFixed(2)} km`
      : null;

  const mapsUrl =
    site.lat && site.lon
      ? `https://www.google.com/maps?q=${site.lat},${site.lon}`
      : null;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{site.sigla}</h3>
        {distance && (
          <span className="text-xs rounded-full bg-emerald-50 text-emerald-700 px-2 py-1">
            {distance}
          </span>
        )}
      </div>
      {site.nome && <p className="text-sm text-gray-700 mt-1">{site.nome}</p>}
      {site.endereco && <p className="text-sm text-gray-500">{site.endereco}</p>}

      <div className="mt-3 flex items-center gap-2 text-sm">
        <MapPin className="w-4 h-4 text-gray-500" />
        <span>
          {site.lat && site.lon ? `${site.lat.toFixed(6)}, ${site.lon.toFixed(6)}` : "Sem coordenadas"}
        </span>
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-emerald-700 hover:underline"
          >
            <Route className="w-4 h-4" /> Rotas
          </a>
        )}
      </div>
    </div>
  );
}