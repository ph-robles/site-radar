'use client';

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// importa ícones corrigidos
import "../leaflet-icons";

export default function Mapa() {
    return (
        <MapContainer
            center={[-22.90, -43.20]}
            zoom={12}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[-22.90, -43.20]}>
                <Popup>Exemplo</Popup>
            </Marker>
        </MapContainer>
    );
}