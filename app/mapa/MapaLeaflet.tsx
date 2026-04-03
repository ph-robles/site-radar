"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./leaflet-icons";
import { kml } from "@mapbox/togeojson";

export default function MapaLeaflet() {
    useEffect(() => {
        const container = document.getElementById("map");

        // evita criar 2 mapas no mesmo elemento
        if (!container || (container as any)._leaflet_id) return;

        // cria o mapa
        const map = L.map(container).setView([-22.9, -43.2], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        // carrega o KML
        fetch("/doc.kml")
            .then((res) => res.text())
            .then((text) => {
                const xml = new DOMParser().parseFromString(text, "text/xml");
                const geojson = kml(xml);

                const layer = L.geoJSON(geojson, {
                    style: {
                        color: "#7300E6",
                        weight: 2,
                        fillOpacity: 0.3,
                    },
                }).addTo(map);

                const bounds = layer.getBounds();
                if (bounds.isValid()) {
                    map.fitBounds(bounds);
                }
            })
            .catch((err) => console.error("Erro ao carregar KML:", err));

        // ✅ CLEANUP CORRETO — NÃO RETORNA NADA
        return () => {
            map.remove(); // remove o mapa sem retornar nada
        };
    }, []);

    return null;
}