"use client";

import { useState, useEffect } from "react";
import { buscarSugestoesSigla } from "@/services/sites";

export default function SugestoesSigla({
    sigla,
    onSelect,
}: {
    sigla: string;
    onSelect: (valor: string) => void;
}) {
    const [lista, setLista] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function buscar() {
            if (sigla.length < 2) {
                setLista([]);
                return;
            }

            setLoading(true);
            try {
                const s = await buscarSugestoesSigla(sigla);
                setLista(s || []);
            } catch {
                setLista([]);
            }
            setLoading(false);
        }

        buscar();
    }, [sigla]);

    if (sigla.length < 2) return null;

    return (
        <div className="mt-3 bg-white rounded-xl shadow border divide-y">
            {loading && (
                <div className="p-3 text-gray-500 text-sm">Carregando...</div>
            )}

            {!loading && lista.length === 0 && (
                <div className="p-3 text-gray-500 text-sm">
                    Nenhuma ERB encontrada.
                </div>
            )}

            {!loading &&
                lista.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item.sigla)}
                        className="w-full text-left p-3 hover:bg-[#A566FF22] transition flex items-center gap-2"
                    >
                        <span className="text-[#7300E6] text-lg">🔎</span>
                        <span className="font-semibold text-[#4B0099]">
                            {item.sigla}
                        </span>
                        <span className="text-gray-500 text-sm">{item.nome}</span>
                    </button>
                ))}
        </div>
    );
}