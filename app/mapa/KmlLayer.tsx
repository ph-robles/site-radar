"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import omnivore from "@mapbox/leaflet-omnivore";
import L from "leaflet";

export default function KmlLayer() {
    const map = useMap();
    const layerRef = useRef<L.Layer | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;

        if (!map) return;

        const layer = omnivore.kml("/doc.kml");

        layer.on("ready", () => {
            if (!mountedRef.current) return;
            if (!map) return;

            layer.addTo(map);

            if (layer.getBounds && layer.getBounds().isValid()) {
                map.fitBounds(layer.getBounds());
            }
        });

        layer.on("error", (e: unknown) => {
            console.error("Erro ao carregar KML:", e);
        });

        layerRef.current = layer;

        return () => {
            mountedRef.current = false;

            try {
                if (layerRef.current && map.hasLayer(layerRef.current)) {
                    map.removeLayer(layerRef.current);
                }
            } catch {
                // ✅ ignora bug interno do Leaflet
            }
        };
    }, [map]);

    return null;
}