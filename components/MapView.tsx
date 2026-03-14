"use client";
 
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { getSites } from "@/services/sites";
import { title } from "process";
 
type Site = {
  id: number;
  sigla: string;
  nome: string;
  detentora: string;
  lat: number;
  lon: number;
};
 
export default function MapView() {
 
  const [sites, setSites] = useState<Site[]>([]);
 
  useEffect(() => {
 
    async function loadSites() {
      const data = await getSites();
      setSites(data);
    }
 
    loadSites();
 
  }, []);
 
  return (
 
    <MapContainer
      center={[-22.9068, -43.1729]}
      zoom={11}
      style={{ height: "600px", width: "100%" }}
    >
 
      <TileLayer
        attribution='© OpenStreetMap'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
 
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
 
  );
}

 