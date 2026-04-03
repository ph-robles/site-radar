"use client";

import dynamic from "next/dynamic";

const MapaLeaflet = dynamic(() => import("./MapaLeaflet"), {
    ssr: false,
    loading: () => <p>Carregando mapa...</p>,
});

export default function Page() {
    return (
        <main style={{ width: "100%", height: "100vh" }}>
            <MapaLeaflet />
        </main>
    );
}