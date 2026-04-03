"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { defaultIcon } from "./leaflet-icons";
import KmlLayer from "./KmlLayer";

export default function MapaLeaflet() {
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        // garantir client
        if (typeof window === "undefined") return;

        // Se o mapa já foi criado, não recriar
        if (mapRef.current) return;

        const map = L.map("map", {
            zoomControl: true,
            preferCanvas: true,
        }).setView([-22.90, -43.17], 11);

        mapRef.current = map;

        // camada base
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
        }).addTo(map);

        // ícone padrão
        L.Marker.prototype.options.icon = defaultIcon;

        // carregar KML
        KmlLayer("/kml/arquivo.kml", map);
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
