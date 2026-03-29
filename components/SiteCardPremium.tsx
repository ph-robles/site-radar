
import Link from "next/link";
import { getStatus } from "@/lib/status";

export default function SiteCardPremium({ site }: { site: any }) {
    const status = getStatus(site.data_vencimento);
    const distanciaKm = site.distancia
        ? (site.distancia / 1000).toFixed(2)
        : null;

    return (
        <div className="rounded-2xl bg-white shadow-lg border p-5 hover:shadow-2xl transition">

            <Link href={`/erb/${site.id}`}>
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-[#7300E6] hover:underline">
                        {site.sigla}
                    </h2>

                    <span
                        className={`px-3 py-1 text-sm rounded-full font-semibold bg-${status.color}-100 text-${status.color}-700`}
                    >
                        {status.label}
                    </span>
                </div>
            </Link>

            <p className="text-gray-700 text-lg font-medium">{site.nome}</p>
            <p className="text-gray-500 text-sm">{site.endereco}</p>

            {distanciaKm && (
                <p className="mt-3 text-gray-800 font-semibold">
                    📏 {distanciaKm} km até você
                </p>
            )}

            {site.capacitado === "SIM" && (
                <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 mt-2 rounded-full font-semibold">
                    ⚡ ERB Capacitada
                </span>
            )}

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
        </div>
    );
}
