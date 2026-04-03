"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as toGeoJSON from "@mapbox/togeojson";

export default async function KmlLayer(url: string, map: L.Map) {
    const response = await fetch(url);
    const kmlText = await response.text();

    const parser = new DOMParser();
    const kml = parser.parseFromString(kmlText, "text/xml");

    const geojson = toGeoJSON.kml(kml);

    const layer = L.geoJSON(geojson, {
        style: {
            color: "#ff0000",
            weight: 2,
        },
    });

    layer.addTo(map);
}
