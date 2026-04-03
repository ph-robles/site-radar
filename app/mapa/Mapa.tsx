"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../leaflet-icons";
import KmlLayer from "./KmlLayer";

export default function Mapa() {
    return (
        <MapContainer
            center={[-22.9, -43.2]}
            zoom={12}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />

            {/* ✅ Camada KML */}
            <KmlLayer />
        </MapContainer>
    );
}