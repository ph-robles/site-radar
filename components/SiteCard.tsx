import { getStatus } from "@/lib/status";

export default function SiteCard({ site }: any) {
    const status = getStatus(site.data_vencimento);

    return (
        <div className="rounded-2xl shadow-md bg-white p-4 border border-gray-100 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-gray-900">{site.sigla}</h2>

            <p className="text-gray-700">{site.nome}</p>
            <p className="text-gray-500 text-sm">{site.endereco}</p>

            <span
                className={`mt-2 inline-block text-sm px-2 py-1 rounded-full bg-${status.color}-100 text-${status.color}-700`}
            >
                {status.label}
            </span>

            {site.capacitado === "SIM" && (
                <p className="mt-2 text-xs px-2 py-1 rounded-full inline-block bg-purple-100 text-purple-700 font-semibold">
                    ⚡ ERB Capacitada
                </p>
            )}

            <div className="flex gap-3 mt-4">
                <a
                    href={`https://www.google.com/maps?q=${site.lat},${site.lon}`}
                    target="_blank"
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
                >
                    Ver no Mapa
                </a>

                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`}
                    target="_blank"
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl"
                >
                    Rota
                </a>
            </div>
        </div>
    );
}
