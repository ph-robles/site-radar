"use client";

import { supabase } from "@/lib/supabase";
import { getStatus } from "@/lib/status";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DistanciaCliente from "@/components/DistanciaCliente";
import BotoesPremium from "@/components/BotoesPremium";
import MiniMapa from "@/components/MiniMapa";


export default function ErbDetalhesPage({ params }: any) {
    const router = useRouter();
    const id = Number(params.id);

    const [site, setSite] = useState<any>(null);
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!id) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("sites")
                .select("*")
                .eq("id", id)
                .single();

            if (!data || error) {
                setSite(null);
            } else {
                setSite(data);
                setStatus(getStatus(data.data_vencimento));
            }

            setLoading(false);
        }

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <main className="p-4 text-center font-semibold">
                Carregando...
            </main>
        );
    }

    if (!id) {
        return (
            <main className="p-4 text-center text-red-600 font-semibold">
                ERB inválida.
            </main>
        );
    }

    if (!site) {
        return (
            <main className="p-4 text-center text-red-600 font-semibold">
                ERB não encontrada.
            </main>
        );
    }

    return (
        <main className="p-4 space-y-6 max-w-xl mx-auto">

            {/* Botão Voltar */}
            <button
                onClick={() => router.back()}
                className="bg-gray-200 px-4 py-2 rounded-xl shadow hover:bg-gray-300 transition"
            >
                ⬅️ Voltar
            </button>

            {/* Cabeçalho Vivo Premium */}
            <div className="bg-[#7300E6] text-white p-6 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-extrabold">{site.sigla}</h1>
                <p className="text-white/90">{site.nome}</p>
            </div>

            <MiniMapa lat={site.lat} lon={site.lon} />

            <DistanciaCliente lat={site.lat} lon={site.lon} />

            {/* Status */}
            <div className="flex gap-3">
                <span
                    className={`px-4 py-1 rounded-full font-semibold bg-${status.color}-100 text-${status.color}-700`}
                >
                    {status.label}
                </span>

                {site.capacitado === "SIM" && (
                    <span className="px-4 py-1 rounded-full font-semibold bg-purple-100 text-purple-700">
                        ⚡ Capacitada
                    </span>
                )}
            </div>

            {/* Informações da ERB */}
            <div className="bg-white shadow-md rounded-2xl p-5 space-y-3 border">
                <p><b>Endereço:</b> {site.endereco}</p>
                <p><b>Detentora:</b> {site.detentora}</p>
                <p><b>Latitude:</b> {site.lat}</p>
                <p><b>Longitude:</b> {site.lon}</p>
            </div>

            {/* Botões Premium */}
            <BotoesPremium lat={site.lat} lon={site.lon} />

            {/* Detalhes técnicos */}
            <div className="bg-white shadow-md rounded-2xl p-5 space-y-3 border text-black">
                <h2 className="text-xl font-bold text-[#7300E6]">🔧 Detalhes Técnicos</h2>

                <div className="space-y-1">
                    <p><b>ID Interno:</b> {site.id}</p>
                    <p><b>Sigla:</b> {site.sigla}</p>
                    <p><b>Detentora:</b> {site.detentora}</p>
                </div>

                <div className="space-y-1">
                    <p><b>Latitude:</b> {site.lat}</p>
                    <p><b>Longitude:</b> {site.lon}</p>
                </div>

                <div className="space-y-1">
                    <p><b>Status:</b> {status.label}</p>
                    <p><b>Capacitada:</b> {site.capacitado}</p>
                </div>

                <div className="pt-2 text-sm text-gray-600">
                    <p>Mais detalhes técnicos podem ser adicionados futuramente, como:</p>
                    <ul className="list-disc pl-6">
                        <li>Banda / Tecnologia (700 / 1800 / DSS / 5G)</li>
                        <li>Setores</li>
                        <li>Azimute</li>
                        <li>Altura da Torre</li>
                    </ul>
                </div>
            </div>



        </main>
    );
}