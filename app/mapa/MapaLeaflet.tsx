"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import omnivore from "leaflet-omnivore";

export default function MapaLeaflet() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        // ✅ Garante que só cria UMA vez
        if (!mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current).setView(
            [-22.9, -43.2],
            11
        );
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
        }).addTo(map);

        const kmlLayer = omnivore.kml(
            "/erbs.kml",
            null,
            L.geoJson(null, {
                onEachFeature: (feature: any, layer: any) => {
                    const p = feature?.properties || {};

                    layer.bindPopup(`
            <b>SIGLA:</b> ${p.SIGLA || "N/D"}<br>
            <b>LATITUDE:</b> ${p.LATITUDE || "N/D"}<br>
            <b>LONGITUDE:</b> ${p.LONGITUDE || "N/D"}<br>
            <b>MUNICÍPIO:</b> ${p["MUNICIPIO SIGSEUM"] || "N/D"}<br>
            <b>UF:</b> ${p.UF || "N/D"}<br>
            <b>CAPACITADA:</b> ${p.CAPACITADA || "N/D"}
          `);
                },
                style: (feature: any) => {
                    const p = feature?.properties || {};
                    return {
                        color: p.stroke || "#ff0000",
                        fillColor: p.fill || "#ff0000",
                        fillOpacity: p["fill-opacity"] || 0.3,
                        weight: 2,
                    };
                },
            })
        )
            .on("ready", () => {
                map.fitBounds((kmlLayer as any).getBounds());
            })
            .addTo(map);

        // ✅ CLEANUP SEGURO
        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div
            ref={mapContainerRef}
            style={{ height: "100vh", width: "100%" }}
        />
    );
}