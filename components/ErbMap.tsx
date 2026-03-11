"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";

/** Tipos */
export type SiteNear = {
  id: number;
  sigla: string;
  nome: string | null;
  endereco: string | null;
  lat: number | null;
  lon: number | null;
  distancia_m: number;
};

type Props = {
  user: { lat: number; lng: number } | null;
  sites: SiteNear[];
  className?: string;
};

/** Ícone padrão do Leaflet (caminho quebrava no Next). Usamos CDN. */
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// (Opcional) aplica globalmente o ícone default
L.Marker.prototype.options.icon = defaultIcon;

function FitToData({ user, sites }: { user: Props["user"]; sites: SiteNear[] }) {
  const map = useMap();

  useEffect(() => {
    const points: L.LatLngExpression[] = [];

    if (user) points.push([user.lat, user.lng]);

    for (const s of sites) {
      if (typeof s.lat === "number" && typeof s.lon === "number") {
        points.push([s.lat, s.lon]);
      }
    }

    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0] as L.LatLngExpression, 14);
      return;
    }

    // Tipagem correta sem `any`
    const bounds = L.latLngBounds(points as L.LatLngExpression[]);
    map.fitBounds(bounds.pad(0.2), { animate: true, maxZoom: 16 });
  }, [map, user, sites]);

  return null;
}

function formatDistance(m: number) {
  return m < 1000 ? `${m.toFixed(0)} m` : `${(m / 1000).toFixed(2)} km`;
}

/** Componente principal */
export default function ErbMap({ user, sites, className }: Props) {
  const center = useMemo<L.LatLngExpression>(() => {
    if (user) return [user.lat, user.lng];
    return [-22.9068, -43.1729]; // centro do Rio
  }, [user]);

  return (
    <div className={className ?? "h-96 rounded-lg overflow-hidden"}>
      <MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        {/* Tiles do OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <FitToData user={user} sites={sites} />

        {user && (
          <CircleMarker
            center={[user.lat, user.lng]}
            radius={8}
            pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.9 }}
          >
            <Popup>Você está aqui</Popup>
          </CircleMarker>
        )}

        {sites
          .filter((s) => typeof s.lat === "number" && typeof s.lon === "number")
          .map((s) => {
            const mapsUrl = `https://www.google.com/maps?q=${s.lat},${s.lon}`;
            return (
              <Marker key={s.id} position={[s.lat!, s.lon!]} icon={defaultIcon}>
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <strong>{s.sigla}</strong>
                    {s.nome && <div style={{ fontSize: 12 }}>{s.nome}</div>}
                    {s.endereco && <div style={{ fontSize: 12, color: "#555" }}>{s.endereco}</div>}
                    <div style={{ marginTop: 6, fontSize: 12 }}>
                      <span
                        style={{ background: "#ecfdf5", color: "#065f46", padding: "2px 6px", borderRadius: 999 }}
                      >
                        {formatDistance(s.distancia_m)}
                      </span>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#047857", textDecoration: "underline", fontSize: 13 }}
                      >
                        Abrir no Google Maps
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}
