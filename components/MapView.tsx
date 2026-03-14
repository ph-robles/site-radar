"use client";
 
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { getSites } from "@/services/sites";
import SearchBar from "./SearchBar";
import L from "leaflet";
 
type Site = {
  id: number;
  sigla: string;
  nome: string;
  detentora: string;
  lat: number;
  lon: number;
};
 
/* ---------------------- ICONES ---------------------- */
 
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
 
/* ---------------------- FLY TO SITE ---------------------- */
 
function FlyToSite({ site }: { site: Site | null }) {
 
  const map = useMap();
 
  useEffect(() => {
    if (site) {
      map.flyTo([Number(site.lat), Number(site.lon)], 15);
    }
  }, [site, map]);
 
  return null;
}
 
/* ---------------------- MAP VIEW ---------------------- */
 
export default function MapView() {
 
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
 
  useEffect(() => {
 
    async function loadSites() {
 
      const data = await getSites();
 
      console.log("Sites carregados:", data?.length);
 
      setSites(data);
 
    }
 
    loadSites();
 
  }, []);
 
  return (
 
    <div>
 
      <SearchBar onResult={setSelectedSite} />
 
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
 
        {/* CÍRCULO DE 2KM */}
 
        {selectedSite && (
 
          <Circle
            center={[Number(selectedSite.lat), Number(selectedSite.lon)]}
            radius={2000}
            pathOptions={{
              color: "red",
              fillColor: "red",
              fillOpacity: 0.1,
            }}
          />
 
        )}
 
        {/* MARCADORES */}
 
        {sites
          .filter((site) => site.lat && site.lon)
          .map((site) => (
 
            <Marker
              key={site.id}
              position={[Number(site.lat), Number(site.lon)]}
              icon={selectedSite?.id === site.id ? redIcon : defaultIcon}
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
 
      </MapContainer>
 
    </div>
 
  );
}
 