"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { defaultIcon } from "./leaflet-icons";
import KmlLayer from "./KmlLayer";

export default function MapaLeaflet() {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!containerRef.current) return;

        // Se já existe um mapa, não recriar
        if (mapRef.current) return;

        const map = L.map(containerRef.current, {
            zoomControl: true,
            preferCanvas: true,
        }).setView([-22.90, -43.17], 11);

        mapRef.current = map;

        // Camada base
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
        }).addTo(map);

        // Ícone padrão
        L.Marker.prototype.options.icon = defaultIcon;

        // Carregar KML
        KmlLayer("/kml/arquivo.kml", map);

        // ── CLEANUP: destrói o mapa ao desmontar o componente ──
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", height: "100vh" }}
        />
    );
}