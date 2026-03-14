"use client";
 
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap
} from "react-leaflet";
 
import { useEffect, useState } from "react";
 
import "leaflet/dist/leaflet.css";
 
import L from "leaflet";
 
import { getSites } from "@/services/sites";
import SearchBar from "./SearchBar";
 
import MarkerClusterGroup from "react-leaflet-cluster";
 
type Site = {
  id: number;
  sigla: string;
  nome: string;
  detentora: string;
  lat: number;
  lon: number;
};
 
/* ---------------- ICONES ---------------- */
 
const defaultIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
 
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
 
/* ---------------- DISTANCIA ENTRE SITES ---------------- */
 
function calcDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
 
  const R = 6371;
 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
 
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
 
  return R * c;
}
 
/* ---------------- ZOOM NO SITE ---------------- */
 
function FlyToSite({ site }: { site: Site | null }) {
 
  const map = useMap();
 
  useEffect(() => {
 
    if (site) {
      map.flyTo(
        [Number(site.lat), Number(site.lon)],
        15
      );
    }
 
  }, [site, map]);
 
  return null;
}
 
/* ---------------- MAPA ---------------- */
 
export default function MapView() {
 
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [nearSites, setNearSites] = useState<any[]>([]);
 
  /* ----------- CARREGAR SITES ----------- */
 
  useEffect(() => {
 
    async function loadSites() {
 
      const data = await getSites();
 
      console.log("Sites carregados:", data?.length);
 
      setSites(data);
 
    }
 
    loadSites();
 
  }, []);
 
  /* ----------- CALCULAR SITES PROXIMOS ----------- */
 
  useEffect(() => {
 
    if (!selectedSite) return;
 
    const nearby = sites
      .filter((s) => s.id !== selectedSite.id)
      .map((s) => {
 
        const distance = calcDistance(
          Number(selectedSite.lat),
          Number(selectedSite.lon),
          Number(s.lat),
          Number(s.lon)
        );
 
        return {
          ...s,
          distance
        };
 
      })
      .filter((s) => s.distance <= 2)
      .sort((a, b) => a.distance - b.distance);
 
    setNearSites(nearby);
 
  }, [selectedSite, sites]);
 
  return (
 
    <div>
 
      {/* BUSCA */}
 
      <SearchBar onResult={setSelectedSite} />
 
      {/* LISTA DE SITES PROXIMOS */}
 
      {selectedSite && (
 
        <div
          style={{
            background: "#fff",
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            border: "1px solid #ddd"
          }}
        >
 
          <b>Sites dentro de 2 km</b>
 
          {nearSites.length === 0 && (
            <p>Nenhum site próximo</p>
          )}
 
          {nearSites.map((s) => (
 
            <div key={s.id}>
 
              {s.sigla} — {s.distance.toFixed(2)} km
 
            </div>
 
          ))}
 
        </div>
 
      )}
 
      {/* MAPA */}
 
      <MapContainer
        center={[-22.9068, -43.1729]}
        zoom={11}
        style={{
          height: "600px",
          width: "100%"
        }}
      >
 
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
 
        <FlyToSite site={selectedSite} />
 
        {/* CIRCULO DE COBERTURA */}
 
        {selectedSite && (
 
          <Circle
            center={[
              Number(selectedSite.lat),
              Number(selectedSite.lon)
            ]}
            radius={2000}
            pathOptions={{
              color: "red",
              fillColor: "red",
              fillOpacity: 0.1
            }}
          />
 
        )}
 
        {/* CLUSTER DE SITES */}
 
        <MarkerClusterGroup>
 
          {sites
            .filter((site) => site.lat && site.lon)
            .map((site) => (
 
              <Marker
                key={site.id}
                position={[
                  Number(site.lat),
                  Number(site.lon)
                ]}
                icon={
                  selectedSite?.id === site.id
                    ? redIcon
                    : defaultIcon
                }
              >
 
                <Popup>
 
                  <div style={{ minWidth: 150 }}>
 
                    <b>Site:</b> {site.sigla ?? "N/A"}
 
                    <br />
 
                    <b>Nome:</b> {site.nome ?? "N/A"}
 
                    <br />
 
                    <b>Operadora:</b> {site.detentora ?? "N/A"}
 
                    <br />
 
                    <b>Lat:</b>{" "}
                    {Number(site.lat).toFixed(5)}
 
                    <br />
 
                    <b>Lon:</b>{" "}
                    {Number(site.lon).toFixed(5)}
 
                  </div>
 
                </Popup>
 
              </Marker>
 
            ))}
 
        </MarkerClusterGroup>
 
      </MapContainer>
 
    </div>
 
  );
}
 