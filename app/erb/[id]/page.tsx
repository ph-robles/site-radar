
import { supabase } from "@/lib/supabase";
import { getStatus } from "@/lib/status";

export default async function ErbDetalhesPage({ params }: any) {
    const { data: site } = await supabase
        .from("sites")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!site) {
        return (
            <main className="p-4 text-center text-red-600 font-semibold">
                ERB não encontrada.
            </main>
        );
    }

    const status = getStatus(site.data_vencimento);

    return (
        <main className="p-4 space-y-6 max-w-xl mx-auto">

            {/* VOLTAR */}
            <button
                onClick={() => history.back()}
                className="bg-gray-200 px-4 py-2 rounded-xl shadow hover:bg-gray-300 transition"
            >
                ⬅️ Voltar
            </button>

            {/* HEADER */}
            <div className="bg-[#7300E6] text-white p-6 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-extrabold">{site.sigla}</h1>
                <p className="opacity-90">{site.nome}</p>
            </div>

            {/* STATUS */}
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

            {/* INFORMAÇÕES PRINCIPAIS */}
            <div className="bg-white shadow-md rounded-2xl p-5 space-y-3 border">
                <p><b>Endereço:</b> {site.endereco}</p>
                <p><b>Detentora:</b> {site.detentora}</p>
                <p><b>Latitude:</b> {site.lat}</p>
                <p><b>Longitude:</b> {site.lon}</p>
            </div>

            {/* BOTÕES */}
            <div className="flex gap-3 mt-4">

                <a
                    href={`https://www.google.com/maps?q=${site.lat},${site.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold underline"
                >
                    Ver no Mapa
                </a>

                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 font-semibold underline"
                >
                    Traçar Rota
                </a>

            </div>
        </main>
    );
}
