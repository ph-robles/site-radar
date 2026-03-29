import { getStatus } from "@/lib/status";

export default function SiteCardPro({ site }: { site: any }) {
    const status = getStatus(site.data_vencimento);
    const distanciaKm = (site.distancia / 1000).toFixed(2);

    return (
        <div className="rounded-2xl shadow-md bg-white p-4 border border-gray-100 hover:shadow-lg transition">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">{site.sigla}</h2>

                <span
                    className={`text-sm px-2 py-1 rounded-full bg-${status.color}-100 text-${status.color}-700`}
                >
                    {status.label}
                </span>
            </div>

            {/* Nome / Endereço */}
            <p className="text-gray-600 mt-1">{site.nome}</p>
            <p className="text-gray-500 text-sm">{site.endereco}</p>

            {/* Distância */}
            <p className="mt-3 text-gray-800 font-semibold">
                📏 {distanciaKm} km de distância
            </p>

            {/* Capacitada */}
            {site.capacitado === "sim" && (
                <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                    ⚡ ERB Capacitada
                </span>
            )}

            {/* Botões */}
            <div className="flex gap-2 mt-4">
                <a
                    href={`https://www.google.com/maps?q=${site.lat},${site.lon}`}
                    target="_blank"
                    className="flex-1 text-center bg-blue-500 text-white px-3 py-2 rounded-lg"
                >
                    Ver no mapa
                </a>

                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`}
                    target="_blank"
                    className="flex-1 text-center bg-green-500 text-white px-3 py-2 rounded-lg"
                >
                    Rota
                </a>
            </div>
        </div>
    );
}