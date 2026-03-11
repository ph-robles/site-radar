"use client";
 
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
 
export type SiteNear = {
  id: number;
  sigla: string;
  nome: string | null;
  endereco: string | null;
  lat: number | null;
  lon: number | null;
  distancia_m: number;
  capacitado: string | null;
};
 
type Props = {
  user: { lat: number; lng: number };
  sites: SiteNear[];
  className?: string;
};
 
const userIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
});
 
const capacitadoIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
  iconSize: [32, 32],
});
 
const normalIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  iconSize: [32, 32],
});
 
export default function ErbMap({ user, sites, className }: Props) {
 
  const melhorSite = sites.length > 0 ? sites[0] : null;
 
  return (
    <MapContainer
      center={[user.lat, user.lng]}
      zoom={15}
      scrollWheelZoom={true}
      className={className}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
 
      <Marker position={[user.lat, user.lng]} icon={userIcon}>
        <Popup>Você está aqui</Popup>
      </Marker>
 
      {melhorSite && melhorSite.lat && melhorSite.lon && (
        <Polyline
          positions={[
            [user.lat, user.lng],
            [melhorSite.lat, melhorSite.lon],
          ]}
          pathOptions={{ color: "green", weight: 4 }}
        />
      )}
 
      {sites.map((site) => {
        if (!site.lat || !site.lon) return null;
 
        const isCapacitado =
          site.capacitado?.toLowerCase() === "sim";
 
        const icon = isCapacitado
          ? capacitadoIcon
          : normalIcon;
 
        return (
          <Marker
            key={site.id}
            position={[site.lat, site.lon]}
            icon={icon}
          >
            <Popup>
              <strong>{site.sigla}</strong>
 
              <br />
 
              {site.nome}
 
              <br />
 
              distância: {Math.round(site.distancia_m)} m
 
              <br />
 
              capacitado: {site.capacitado}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}