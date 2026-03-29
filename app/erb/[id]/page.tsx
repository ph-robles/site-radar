import { supabase } from "@/lib/supabase";
import { getStatus } from "@/lib/status";

export default async function ErbDetalhesPage({
    params,
}: {
    params: { id: string };
}) {
    const { data: site } = await supabase
        .from("sites")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!site) {
        return <p className="text-red-600">ERB não encontrada.</p>;
    }

    const status = getStatus(site.data_vencimento);

    return (
        <main className="p-4 space-y-4">
            <button
                onClick={() => history.back()}
                className="px-4 py-2 bg-gray-300 rounded-lg"
            >
                ⬅️ Voltar
            </button>

            <h1 className="text-2xl font-bold">{site.sigla}</h1>
            <p className="text-gray-700">{site.nome}</p>

            <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full bg-${status.color}-100 text-${status.color}-700`}>
                    {status.label}
                </span>

                {site.capacitado === "SIM" && (
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                        ⚡ Capacitada
                    </span>
                )}
            </div>

            <p className="text-gray-600">{site.endereco}</p>

            <p className="font-semibold">📡 Latitude: {site.lat}</p>
            <p className="font-semibold">📡 Longitude: {site.lon}</p>

            <div className="flex gap-3 mt-4">
                <a
                    href={`https://www.google.com/maps?q=${site.lat},${site.lon}`}
                    target="_blank"
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                >
                    Ver no mapa
                </a>

                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`}
                    target="_blank"
                    className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
                >
                    Traçar rota
                </a>
            </div>
        </main>
    );
}