"use client";

import SearchInput from "@/components/SearchInput";
import SiteCard from "@/components/SiteCard";
import Loader from "@/components/Loader";
import { useBuscarSite } from "@/hooks/useBuscarSite";

export default function BuscarPage() {
    const { buscar, site, loading, erro } = useBuscarSite();

    return (
        <main className="p-4 max-w-xl mx-auto space-y-4">

            <SearchInput onSearch={buscar} />

            {loading && (
                <div className="flex justify-center">
                    <Loader />
                </div>
            )}

            {erro && (
                <p className="text-red-500 font-medium" role="alert">
                    {erro}
                </p>
            )}

            {site && <SiteCard site={site} />}
        </main>
    );
}