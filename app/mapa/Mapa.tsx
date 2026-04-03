"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import omnivore from "@mapbox/leaflet-omnivore";

// importa ícones corrigidos
import "../leaflet-icons";

/* ✅ Componente que carrega o KML */
function KmlLayer() {
    const map = useMap();

    useEffect(() => {
        const layer = omnivore.kml("/doc.kml");

        layer.on("ready", () => {
            layer.addTo(map);
            map.fitBounds(layer.getBounds());
        });

        layer.on("error", (e: unknown) => {
            console.error("Erro ao carregar KML:", e);
        });

        return () => {
            map.removeLayer(layer);
        };
    }, [map]);

    return null;
}

export default function Mapa() {
    return (
        <MapContainer
            center={[-22.9, -43.2]}
            zoom={12}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <KmlLayer />
        </MapContainer>
    );
}