"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./leaflet-icons";
import { kml } from "@mapbox/togeojson";

export default function MapaLeaflet() {
    useEffect(() => {
        // 🔒 Garante que o mapa só é criado uma vez
        const container = document.getElementById("map");
        if (!container || (container as any)._leaflet_id) return;

        const map = L.map(container).setView([-22.9, -43.2], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        // ✅ Carregar KML de forma segura
        fetch("/doc.kml")
            .then((res) => res.text())
            .then((text) => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, "text/xml");
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
            .catch((err) => {
                console.error("Erro ao carregar KML:", err);
            });

        // ✅ Cleanup SEGURO
        return () => {
            map.remove();
        };
    }, []);

    return null;
}