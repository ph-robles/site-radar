"use client";

import { useEffect } from "react";
import L, { GeoJSON } from "leaflet";
import "leaflet/dist/leaflet.css";
import omnivore from "leaflet-omnivore";

export default function MapaPage() {
    useEffect(() => {
        // Evita recriar o mapa quando navegar no Next.js
        const el = document.getElementById("map") as any;
        if (el && el._leaflet_id) {
            el._leaflet_id = null;
        }

        const map = L.map("map").setView([-22.9, -43.2], 11);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
        }).addTo(map);

        // ✅ Carrega o KML usando omnivore
        const kmlLayer = omnivore.kml("/erbs.kml", null, L.geoJson(null, {
            onEachFeature: (feature: any, layer: any) => {
                const props = feature?.properties || {};

                const latitude = props.LATITUDE || props.latitude || "N/D";
                const longitude = props.LONGITUDE || props.longitude || "N/D";
                const sigla = props.SIGLA || props.sigla || "N/D";
                const municipio = props["MUNICIPIO SIGSEUM"] || props.MUNICIPIO || "N/D";
                const uf = props.UF || "N/D";
                const capacitada = props.CAPACITADA || "N/D";

                const popup = `
          <div style="font-size:14px">
            <b>SIGLA:</b> ${sigla}<br>
            <b>LATITUDE:</b> ${latitude}<br>
            <b>LONGITUDE:</b> ${longitude}<br>
            <b>MUNICÍPIO:</b> ${municipio}<br>
            <b>UF:</b> ${uf}<br>
            <b>CAPACITADA:</b> ${capacitada}
          </div>
        `;

                layer.bindPopup(popup);
            },

            // ✅ Mantém cores de polígonos e áreas de risco do KML
            style: (feature: any) => {
                const p = feature?.properties || {};
                return {
                    color: p.stroke || "#ff0000",
                    weight: 2,
                    fillColor: p.fill || "#ff0000",
                    fillOpacity: p["fill-opacity"] || 0.3,
                };
            },
        }))
            .on("ready", function () {
                map.fitBounds((kmlLayer as any).getBounds());
            })
            .addTo(map);

    }, []);

    return (
        <div
            id="map"
            style={{ height: "100vh", width: "100%" }}
        ></div>
    );
}