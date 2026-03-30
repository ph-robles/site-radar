"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import SiteCardPremium from "@/components/SiteCardPremium";
import { buscarSitesProximos } from "@/services/sites";

export default function ProximoPage() {
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [sites, setSites] = useState<any[]>([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                const resultado = await buscarSitesProximos(lat, lon);
                setSites(resultado);
                setLoading(false);
            },
            () => {
                setErro("Permita o acesso à localização para continuar.");
                setLoading(false);
            }
        );
    }, []);

    return (
        <main className="p-4 max-w-xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">
                📍 ERBs próximas de você
            </h1>

            {loading && <Loader />}
            {erro && <p className="text-red-500">{erro}</p>}

            <div className="space-y-4">
                {sites.map((s, i) => (
                    <SiteCardPremium key={i} site={s} />
                ))}
            </div>
        </main>
    );
}