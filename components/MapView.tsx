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
 
/* ---------- ICONES ---------- */
 
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
 
/* ---------- DISTANCIA ---------- */
 
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
 
/* ---------- FLY TO ---------- */
 
function FlyToSite({ site }: { site: Site | null }) {
 
  const map = useMap();
 
  useEffect(() => {
    if (site) {
      map.flyTo([Number(site.lat), Number(site.lon)], 15);
    }
  }, [site, map]);
 
  return null;
}
 
/* ---------- MAP ---------- */
 
export default function MapView() {
 
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [nearSites, setNearSites] = useState<any[]>([]);
 
  useEffect(() => {
 
    async function loadSites() {
 
      const data = await getSites();
 
      console.log("Sites carregados:", data?.length);
 
      setSites(data);
 
    }
 
    loadSites();
 
  }, []);
 
  /* ---------- CALCULAR SITES PROXIMOS ---------- */
 
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
 
      <SearchBar onResult={setSelectedSite} />
 
      {/* LISTA DE SITES PROXIMOS */}
 
      {selectedSite && (
 
        <div
          style={{
            background: "#fff",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8
          }}
        >
 
          <b>Sites dentro de 2 km</b>
 
          {nearSites.length === 0 && <p>Nenhum site próximo</p>}
 
          {nearSites.map((s) => (
 
            <div key={s.id}>
 
              {s.sigla} — {s.distance.toFixed(2)} km
 
            </div>
 
          ))}
 
        </div>
 
      )}
 
      <MapContainer
        center={[-22.9068, -43.1729]}
        zoom={11}
        style={{ height: "600px", width: "100%" }}
      >
 
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
 
        <FlyToSite site={selectedSite} />
 
        {/* CIRCULO */}
 
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
 
        {/* CLUSTER */}
 
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
 
                  <b>{site.sigla}</b>
 
                  <br />
 
                  {site.nome}
 
                  <br />
 
                  Operadora: {site.detentora}
 
                </Popup>
 
              </Marker>
 
            ))}
 
        </MarkerClusterGroup>
 
      </MapContainer>
 
    </div>
 
  );
}
 