"use client";

import { useEffect, useRef } from "react";
import { defaultIcon } from "./leaflet-icons";
import KmlLayer from "./KmlLayer";

// Flag global — garante que o Leaflet só inicializa UMA vez por sessão
let mapInstance: any = null;

export default function MapaLeaflet() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!containerRef.current) return;

        // Importa Leaflet dinamicamente para evitar conflito de SSR e CSS
        let isMounted = true;

        async function initMap() {
            // Importa L e o CSS de forma dinâmica
            const L = (await import("leaflet")).default;
            await import("leaflet/dist/leaflet.css" as any);

            // Se o componente foi desmontado enquanto importava, para aqui
            if (!isMounted) return;

            // Se já existe uma instância no container, destrói antes de recriar
            if (mapInstance) {
                try {
                    mapInstance.remove();
                } catch (_) { }
                mapInstance = null;
            }

            // Verifica se o container já tem um mapa inicializado pelo Leaflet
            const container = containerRef.current as any;
            if (container._leaflet_id) {
                return;
            }

            const map = L.map(container, {
                zoomControl: true,
                preferCanvas: true,
            }).setView([-22.9, -43.17], 11);

            mapInstance = map;

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
            }).addTo(map);

            L.Marker.prototype.options.icon = defaultIcon;

            KmlLayer("/kml/arquivo.kml", map);
        }

        initMap();

        return () => {
            isMounted = false;
            if (mapInstance) {
                try {
                    mapInstance.remove();
                } catch (_) { }
                mapInstance = null;
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