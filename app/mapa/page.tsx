"use client";

import MapaLeaflet from "./MapaLeaflet";

export default function MapaPage() {
    return (
        <>
            <MapaLeaflet />
            <div id="map" style={{ height: "100vh", width: "100%" }} />
        </>
    );
}