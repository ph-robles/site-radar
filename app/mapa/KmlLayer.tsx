"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import omnivore from "@mapbox/leaflet-omnivore";
import L from "leaflet";

export default function KmlLayer() {
    const map = useMap();
    const layerRef = useRef<L.Layer | null>(null);

    useEffect(() => {
        if (!map) return;

        const layer = omnivore.kml("/doc.kml");

        layer.on("ready", () => {
            if (!map) return;

            layer.addTo(map);

            // Proteção: só ajusta zoom se houver bounds válidos
            if (layer.getBounds && layer.getBounds().isValid()) {
                map.fitBounds(layer.getBounds());
            }
        });

        layer.on("error", (e: unknown) => {
            console.error("Erro ao carregar KML:", e);
        });

        layerRef.current = layer;

        return () => {
            // ✅ Cleanup seguro (evita removeChild null)
            try {
                if (layerRef.current && map.hasLayer(layerRef.current)) {
                    map.removeLayer(layerRef.current);
                }
            } catch {
                // ignora erro interno do Leaflet
            }
        };
    }, [map]);

    return null;
}