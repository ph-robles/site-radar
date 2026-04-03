"use client";

import dynamic from "next/dynamic";

const MapaLeaflet = dynamic(() => import("./MapaLeaflet"), {
    ssr: false,
});

export default function MapaPage() {
    return <MapaLeaflet />;
}