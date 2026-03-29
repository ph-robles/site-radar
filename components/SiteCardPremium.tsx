import Link from "next/link";
import { getStatus } from "@/lib/status";

export default function SiteCardPremium({ site }: { site: any }) {
    const status = getStatus(site.data_vencimento);
    const distanciaKm = site.distancia ? (site.distancia / 1000).toFixed(2) : null;

    return (
        <div className="rounded-2xl bg-white shadow-lg border border-gray-200 p-5 hover:shadow-2xl transition cursor-pointer">

            {/* Header com Sigla */}
            <Link href={`/erb/${site.id}`}>
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-[#7300E6]">
                        {site.sigla}
                    </h2>

                    <span
                        className={`px-3 py-1 text-sm rounded-full font-semibold bg-${status.color}-100 text-${status.color}-700`}
                    >
                        {status.label}
                    </span>
                </div>
            </Link>

            {/* Nome e endereço */}
            <p className="text-gray-700 text-lg font-medium">{site.nome}</p>
            <p className="text-gray-500 text-sm">{site.endereco}</p>

            {/* Distância */}
            {distanciaKm && (
                <p className="mt-3 text-gray-800 font-semibold">
                    📏 {distanciaKm} km
                </p>
            )}

            {/* Badge Capacitada */}
            {site.capacitado === "SIM" && (
                <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 mt-2 rounded-full font-semibold">
                    ⚡ ERB Capacitada
                </span>
            )}

            {/* Ações */}
            <div className="flex gap-3 mt-4">

                <a
                    href={`https://www.google.com/maps?q=${site.lat},${site.lon}`}
                    target="_blank"
                    className="px-4 py-2 bg-[#7300E6] text-white rounded-xl font-semibold shadow-md hover:bg-[#4B0099] transition"
                >
                    Ver no Mapa
                </a>

                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`}
                    target="_blank"
                    className="px-4 py-2 bg-[#A566FF] text-white rounded-xl font-semibold shadow-md hover:bg-[#7300E6] transition"
                >
                    Rota
                </a>

            </div>

        </div>
    );
}