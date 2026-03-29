"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import { buscarSitesProximos } from "@/services/sites";

// IMPORTA O MAPA SÓ NO CLIENTE
const MapaLeaflet = dynamic(() => import("@/components/MapaLeaflet"), {
    ssr: false,
});

export default function MapaPage() {
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const [sites, setSites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const userLat = pos.coords.latitude;
                const userLon = pos.coords.longitude;

                setLat(userLat);
                setLon(userLon);

                const resultado = await buscarSitesProximos(userLat, userLon);
                setSites(resultado);

                setLoading(false);
            },
            () => {
                alert("Permita o acesso à localização");
                setLoading(false);
            }
        );
    }, []);

    if (loading) return <Loader />;

    if (!lat || !lon)
        return <p className="text-red-600">Não foi possível obter sua localização.</p>;

    return (
        <main className="p-4 max-w-3xl mx-auto">
            <h1 className="text-xl font-bold mb-3">🗺️ Mapa das ERBs Próximas</h1>

            <MapaLeaflet lat={lat} lon={lon} sites={sites} />
        </main>
    );
}