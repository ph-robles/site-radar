"use client";

import { supabase } from "@/lib/supabase";
import { getStatus } from "@/lib/status";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

            {/* Cabeçalho */}
            <div className="bg-[#7300E6] text-white p-6 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-extrabold">{site.sigla}</h1>
                <p className="opacity-90">{site.nome}</p>
            </div>

            {/* Status */}
            <div className="flex gap-4">
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

            {/* Informações */}
            <div className="bg-white shadow-md rounded-2xl p-5 space-y-3 border">
                <p><b>Endereço:</b> {site.endereco}</p>
                <p><b>Detentora:</b> {site.detentora}</p>
                <p><b>Latitude:</b> {site.lat}</p>
                <p><b>Longitude:</b> {site.lon}</p>
            </div>

            {/* Ações */}
            <div className="flex gap-3 mt-4">

                <a
                    href={`https://www.google.com/maps?q=${site.lat},${site.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
                >
                    Ver no Mapa
                </a>

                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition"
                >
                    Traçar rota
                </a>

            </div>

        </main>
    );
}