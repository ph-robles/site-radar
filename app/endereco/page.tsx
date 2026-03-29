"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import SiteCardPro from "@/components/SiteCardPro";
import { geocodeEndereco } from "@/services/geocode";
import { buscarSitesProximos } from "@/services/sites";

export default function BuscarPorEnderecoPage() {
    const [endereco, setEndereco] = useState("");
    const [loading, setLoading] = useState(false);
    const [sites, setSites] = useState<any[]>([]);
    const [erro, setErro] = useState("");
    const [resultadoEndereco, setResultadoEndereco] = useState("");

    async function buscar() {
        try {
            setLoading(true);
            setErro("");
            setSites([]);

            // 1) Geocoding
            const geo = await geocodeEndereco(endereco);
            setResultadoEndereco(geo.display_name);

            // 2) Buscar ERBs
            const resultado = await buscarSitesProximos(geo.lat, geo.lon);
            setSites(resultado);

        } catch (e: any) {
            setErro(e.message || "Erro ao buscar endereço");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="p-4 max-w-xl mx-auto space-y-4">

            {/* Título */}
            <h1 className="text-2xl font-bold text-gray-800">
                🧭 Buscar por Endereço
            </h1>
            <p className="text-gray-700 -mt-2">Digite o endereço do cliente:</p>

            {/* Input */}
            <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Rua Haddock Lobo, 345"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscar()}
            />

            {/* Botão */}
            <button
                className="btn bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full rounded-xl py-3"
                onClick={buscar}
            >
                🔍 Buscar ERBs próximas
            </button>

            {/* Loader */}
            {loading && (
                <div className="flex flex-col items-center gap-3 mt-6">
                    <Loader />
                    <p className="text-gray-500 text-sm">Convertendo endereço…</p>
                </div>
            )}

            {/* Erro */}
            {erro && <p className="text-red-500">{erro}</p>}

            {/* Endereço encontrado */}
            {resultadoEndereco && (
                <p className="text-sm text-gray-700 mt-2">
                    📍 Endereço encontrado: <b>{resultadoEndereco}</b>
                </p>
            )}

            {/* ERBs encontradas */}
            <div className="space-y-4 mt-4">
                {sites.map((site, index) => (
                    <SiteCardPro key={index} site={site} />
                ))}
            </div>
        </main>
    );
}