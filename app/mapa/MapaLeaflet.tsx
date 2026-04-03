"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { defaultIcon } from "./leaflet-icons";
import KmlLayer from "./KmlLayer";

export default function MapaLeaflet() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Evita recriar o mapa
        const mapContainer = document.getElementById("map");
        if (!mapContainer || mapContainer.children.length > 0) return;

        // Criar mapa
        const map = L.map("map").setView([-22.90, -43.17], 11);

        // Camada base
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
        }).addTo(map);

        // Definir ícone
        L.Marker.prototype.options.icon = defaultIcon;

        // ✅ CARREGAR ARQUIVO KML (se existir)
        KmlLayer("\kml\doc.kml", map);

    }, []);

    return (
        <div
            id="map"
            style={{
                width: "100%",
                height: "100vh",
            }}
        />
    );
}