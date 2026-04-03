"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import omnivore from "leaflet-omnivore";

export default function MapaLeaflet() {
    useEffect(() => {
        const el = document.getElementById("map") as any;
        if (el && el._leaflet_id) el._leaflet_id = null;

        const map = L.map("map").setView([-22.9, -43.2], 11);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
        }).addTo(map);

        const kmlLayer = omnivore.kml("/erbs.kml", null, L.geoJson(null, {
            onEachFeature: (feature: any, layer: any) => {
                const p = feature?.properties || {};

                const popup = `
          <b>SIGLA:</b> ${p.SIGLA || "N/D"}<br>
          <b>LAT:</b> ${p.LATITUDE || "N/D"}<br>
          <b>LON:</b> ${p.LONGITUDE || "N/D"}<br>
          <b>MUNIC:</b> ${p["MUNICIPIO SIGSEUM"] || "N/D"}<br>
          <b>UF:</b> ${p.UF || "N/D"}<br>
          <b>CAPACITADA:</b> ${p.CAPACITADA || "N/D"}
        `;
                layer.bindPopup(popup);
            },
            style: (feature: any) => {
                const p = feature?.properties || {};
                return {
                    color: p.stroke || "#f00",
                    fillColor: p.fill || "#f00",
                    fillOpacity: p["fill-opacity"] || 0.3,
                    weight: 2
                };
            }
        }))
            .on("ready", () => {
                map.fitBounds((kmlLayer as any).getBounds());
            })
            .addTo(map);

    }, []);

    return <div id="map" style={{ height: "100vh" }} />;
}