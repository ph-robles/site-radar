"use client"

import SearchInput from "@/components/SearchInput"
import SiteCard from "@/components/SiteCard"
import { useBuscarSite } from "@/hooks/useBuscarSite"

export default function BuscarPage() {
    const { buscar, site, loading, erro } = useBuscarSite()

    return (
        <div className="p-4 max-w-xl mx-auto space-y-4">

            <SearchInput onSearch={buscar} />

            {loading && <p>Carregando...</p>}

            {erro && <p className="text-red-500">{erro}</p>}

            {site && <SiteCard site={site} />}

        </div>
    )
}