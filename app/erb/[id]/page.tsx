
import { supabase } from "@/lib/supabase";
import { getStatus } from "@/lib/status";
import Link from "next/link";

export default async function ErbDetalhesPage({ params }: any) {
    const id = Number(params.id);

    if (!id) {
        return (
            <main className="p-4 text-center text-red-600 font-semibold">
                ERB inválida.
            </main>
        );
    }

    const { data: site, error } = await supabase
        .from("sites")
        .select("*")
        .eq("id", id)
        .single();

    if (!site || error) {
        return (
            <main className="p-4 text-center text-red-600 font-semibold">
                ERB não encontrada.
            </main>
        );
    }

    const status = getStatus(site.data_vencimento);

    return (
        <main className="p-4 space-y-6 max-w-xl mx-auto">

            {/* Botão Voltar */}
            <button
                onClick={() => history.back()}
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

                https://www.google.com/maps?q=${site.lat},${site.lon}
                Ver no Mapa
                <a>

                    https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}
                    Traçar rota
                </a>

            </div >
        </main >
    );
}
