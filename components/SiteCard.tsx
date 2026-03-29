import { getStatus } from "@/lib/status";

interface Site {
    sigla: string;
    nome: string;
    latitude: number;
    longitude: number;
    data_vencimento: string;
}

export default function SiteCard({ site }: { site: Site }) {
    const status = getStatus(site.data_vencimento);

    return (
        <div className="p-4 rounded-2xl shadow bg-white space-y-2">

            <h2 className="text-xl font-bold">{site.sigla}</h2>
            <p>{site.nome}</p>

            <span className={`font-semibold text-${status.color}-500`}>
                {status.label}
            </span>

            <div className="flex gap-2 mt-3">
                <a
                    href={`https://www.google.com/maps?q=${site.latitude},${site.longitude}`}
                    target="_blank"
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    Ver no mapa
                </a>

                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${site.latitude},${site.longitude}`}
                    target="_blank"
                    className="bg-green-500 text-white px-3 py-1 rounded"
                >
                    Rota
                </a>
            </div>

        </div>
    );
}