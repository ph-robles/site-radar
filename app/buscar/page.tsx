"use client";

import { useState } from "react";
import { buscarSitePorSigla } from "@/services/sites";
import CampoBuscaPremium from "@/components/CampoBuscaPremium";
import SugestoesSigla from "@/components/SugestoesSigla";
import SiteCardPremium from "@/components/SiteCardPremium";

export default function BuscarPage() {
    const [texto, setTexto] = useState("");
    const [site, setSite] = useState<any | null>(null);
    const [erro, setErro] = useState("");

    async function buscarSigla(sigla: string) {
        try {
            setErro("");
            const resultado = await buscarSitePorSigla(sigla);
            setSite(resultado);
        } catch {
            setErro("ERB não encontrada.");
            setSite(null);
        }
    }

    return (
        <main className="p-4 max-w-xl mx-auto space-y-4">

            <h1 className="text-2xl font-extrabold text-[#7300E6]">
                Buscar ERB por Sigla
            </h1>

            {/* Campo Premium */}
            <CampoBuscaPremium onBuscar={(v) => setTexto(v)} />

            {/* Sugestões */}
            <SugestoesSigla
                sigla={texto}
                onSelect={(siglaEscolhida) => {
                    setTexto(siglaEscolhida);
                    buscarSigla(siglaEscolhida);
                }}
            />

            {erro && (
                <p className="text-red-600 font-semibold">{erro}</p>
            )}

            {site && (
                <div className="pt-4">
                    <SiteCardPremium site={site} />
                </div>
            )}

        </main>
    );
}