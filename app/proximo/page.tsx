"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import SiteCardPro from "@/components/SiteCardPro";
import { buscarSitesProximos } from "@/services/sites";

export default function ProximoPage() {
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [sites, setSites] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);

                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        const lat = pos.coords.latitude;
                        const lon = pos.coords.longitude;

                        const resultado = await buscarSitesProximos(lat, lon);

                        setSites(resultado);
                        setLoading(false);
                    },
                    () => {
                        setErro("Para usar esta função, permita o acesso à sua localização.");
                        setLoading(false);
                    }
                );
            } catch {
                setErro("Erro ao obter localização.");
                setLoading(false);
            }
        }

        load();
    }, []);

    return (
        <main className="p-4 max-w-xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">📍 ERBs próximas de você</h1>
            <p className="text-gray-600 -mt-2">Localizando as torres usando GPS...</p>

            {loading && (
                <div className="flex flex-col items-center gap-3 mt-10">
                    <Loader />
                    <p className="text-gray-500 text-sm">Buscando localização...</p>
                </div>
            )}

            {erro && <p className="text-red-500">{erro}</p>}

            <div className="space-y-4">
                {sites.map((site, index) => (
                    <SiteCardPro key={index} site={site} />
                ))}
            </div>
        </main>
    );
}