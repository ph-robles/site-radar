import Link from "next/link";
import { getStatus } from "@/lib/status";

export default function SiteCardPro({ site }: { site: any }) {
    const status = getStatus(site.data_vencimento);
    const distanciaKm = site.distancia
        ? (site.distancia / 1000).toFixed(2)
        : null;

    return (
        <div className="rounded-2xl shadow-md bg-white p-4 border hover:shadow-lg transition-all">

            {/* SIGLA → ABRE DETALHES */}
            <Link href={`/erb/${site.id}`}>
                <h2 className="text-lg font-bold text-gray-800 hover:underline cursor-pointer">
                    {site.sigla}
                </h2>
            </Link>

            {/* Nome / Endereço */}
            <p className="text-gray-700">{site.nome}</p>
            <p className="text-gray-500 text-sm">{site.endereco}</p>

            {/* Distância */}
            {distanciaKm && (
                <p className="mt-2 font-semibold text-gray-800">
                    📏 {distanciaKm} km
                </p>
            )}

            {/* Capacitada */}
            {site.capacitado === "SIM" && (
                <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                    ⚡ ERB Capacitada
                </span>
            )}

            {/* Botões */}
            <div className="flex gap-3 mt-4">

                <a
                    href={`https://www.google.com/maps?q=${site.lat},${site.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold underline"
                >
                    Ver no mapa
                </a>

                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 font-semibold underline"
                >
                    Traçar rota
                </a>

            </div>
        </div>
    );
}