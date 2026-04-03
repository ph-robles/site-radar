"use client";

// 🔥 ISSO É O QUE RESOLVE O ERRO DA VERCEL
export const dynamic = "force-dynamic";

import MapaLeaflet from "./MapaLeaflet";

export default function MapaPage() {
    return (
        <>
            <MapaLeaflet />
            <div id="map" style={{ height: "100vh", width: "100%" }} />
        </>
    );
}