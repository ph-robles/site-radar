
import Link from "next/link";
import { getStatusPremium, formatarData } from "@/lib/status";
import FotoGaleria from "@/components/FotoGaleria";

export default function SiteCardPremium({ site }: { site: any }) {
    const status = getStatusPremium(site.data_vencimento);
    const distanciaKm =
        site.distancia ? (site.distancia / 1000).toFixed(2) : null;

    return (
        <div className="rounded-2xl bg-white shadow-lg border p-5 hover:shadow-xl transition">

            {/* Cabeçalho com sigla e botão INFO */}
            <div className="flex items-center justify-between mb-3">
                <Link href={`/erb/${site.id}`}>
                    <h2 className="text-2xl font-bold text-[#7300E6] hover:underline cursor-pointer">
                        {site.sigla}
                    </h2>
                </Link>

                {/* BOTÃO INFO */}
                <Link
                    href={`/erb/${site.id}`}
                    className="px-3 py-1 bg-[#A566FF] text-white rounded-lg text-sm font-semibold shadow hover:bg-[#7300E6] transition"
                >
                    INFO
                </Link>
            </div>

            {/* Nome e endereço */}
            <p className="text-gray-700 text-lg font-medium">{site.nome}</p>
            <p className="text-gray-500 text-sm">{site.endereco}</p>

            {/* Acesso e Informações do Site */}
            <div className="mt-3 text-black text-sm space-y-1">

                <p>
                    <b>Retirada da chave:</b> {site.retirada_chave || "N/A"}
                </p>

                <p>
                    <b>Acesso:</b> {site.acesso || "N/A"}
                </p>

                <p>
                    <b>Informação:</b> {site.informacao || "N/A"}
                </p>

            </div>



            {/* Vencimento Premium */}
            <div className="mt-3 text-black">

                <p className="text-sm">
                    <b>Vencimento:</b>{" "}
                    {site.data_vencimento ? formatarData(site.data_vencimento) : "N/A"}
                </p>


                <span
                    className={`inline-block mt-1 text-xs font-bold px-3 py-1 rounded-full bg-${status.color}-100 text-${status.color}-700`}
                >
                    {status.label}
                </span>

                <p className="text-sm mt-1 font-semibold">{status.mensagem}</p>
            </div>


            {/* Galeria de Fotos */}
            <FotoGaleria sigla={site.sigla} />

            {/* Distância */}
            {distanciaKm && (
                <p className="mt-3 text-gray-800 font-semibold">
                    📏 {distanciaKm} km até você
                </p>
            )}



            {/* Capacitada */}
            {site.capacitado === "SIM" && (
                <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 mt-2 rounded-full font-semibold">
                    ⚡ ERB Capacitada
                </span>
            )}





            {/* Botões de Mapa e Rota */}
            <div className="flex gap-3 mt-4">
                <a
                    href={`https://www.google.com/maps?q=${site.lat},${site.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline font-semibold"
                >
                    Ver no mapa
                </a>

                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 underline font-semibold"
                >
                    Traçar rota
                </a>
            </div>
        </div>
    );
}
