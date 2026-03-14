"use client";
 
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { getSites } from "@/services/sites";
import SearchBar from "./SearchBar";
 
type Site = {
  id: number;
  sigla: string;
  nome: string;
  detentora: string;
  lat: number;
  lon: number;
};
 
function FlyToSite({ site }: { site: Site | null }) {
 
  const map = useMap();
 
  useEffect(() => {
    if (site) {
      map.flyTo([site.lat, site.lon], 15);
    }
  }, [site]);
 
  return null;
}
 
export default function MapView() {
 
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
 
  useEffect(() => {
 
    async function loadSites() {
      const data = await getSites();
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
 
        {sites.map((site) => (
 
          <Marker
            key={site.id}
            position={[site.lat, site.lon]}
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

 