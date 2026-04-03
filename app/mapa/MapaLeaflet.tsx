"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabase";

export default function MapaLeaflet() {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current).setView(
            [-22.9, -43.2],
            11
        );
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
        }).addTo(map);

        // ✅ BUSCAR ERBs DO SUPABASE
        const loadERBs = async () => {
            const { data, error } = await supabase
                .from("erbs")
                .select("latitude, longitude, sigla, municipio, uf, capacitada");

            if (error) {
                console.error("Erro ao buscar ERBs:", error);
                return;
            }

            data?.forEach((erb) => {
                if (!erb.latitude || !erb.longitude) return;

                const marker = L.circleMarker(
                    [erb.latitude, erb.longitude],
                    {
                        radius: 6,
                        color: erb.capacitada ? "#16a34a" : "#dc2626",
                        fillColor: erb.capacitada ? "#16a34a" : "#dc2626",
                        fillOpacity: 0.9,
                    }
                ).addTo(map);

                marker.bindPopup(`
          <b>SIGLA:</b> ${erb.sigla}<br>
          <b>MUNICÍPIO:</b> ${erb.municipio}<br>
          <b>UF:</b> ${erb.uf}<br>
          <b>CAPACITADA:</b> ${erb.capacitada ? "SIM" : "NÃO"}
        `);
            });
        };

        loadERBs();

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ height: "100vh", width: "100%" }}
        />
    );
}