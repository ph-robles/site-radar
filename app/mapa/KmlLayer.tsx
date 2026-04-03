"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { kml } from "@mapbox/togeojson";

export default function KmlLayer() {
    const map = useMap();

    useEffect(() => {
        let layer: L.GeoJSON | null = null;
        let aborted = false;

        async function loadKml() {
            try {
                const res = await fetch("/doc.kml");
                if (!res.ok) return;

                const text = await res.text();
                if (aborted) return;

                const parser = new DOMParser();
                const xml = parser.parseFromString(text, "text/xml");

                const geojson = kml(xml);

                layer = L.geoJSON(geojson, {
                    style: {
                        color: "#7300E6",
                        weight: 2,
                        fillOpacity: 0.25,
                    },
                });

                layer.addTo(map);

                const bounds = layer.getBounds();
                if (bounds.isValid()) {
                    map.fitBounds(bounds);
                }
            } catch (err) {
                console.error("Erro ao carregar KML:", err);
            }
        }

        loadKml();

        return () => {
            aborted = true;
            if (layer) {
                map.removeLayer(layer);
            }
        };
    }, [map]);

    return null;
}