"use client";

import { useState } from "react";
import Link from "next/link";

export default function DrawerMenu() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Botão Hamburguer */}
            <button
                onClick={() => setOpen(true)}
                className="fixed top-4 left-4 z-50 bg-[#7300E6] hover:bg-[#4B0099] text-white p-3 rounded-xl shadow-lg transition"
            >
                ☰
            </button>

            {/* Overlay */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40"
                />
            )}

            {/* Drawer */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-[#7300E6] to-[#4B0099]
        shadow-2xl z-50 p-6 transition-transform duration-300 transform
        ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <h2 className="text-2xl font-bold text-white mb-8 tracking-wide">
                    📡 Menu
                </h2>

                <nav className="flex flex-col gap-4 text-lg text-white">
                    <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 font-semibold hover:bg-[#A566FF33] px-3 py-2 rounded-lg transition"
                    >
                        🏠 Início
                    </Link>

                    <Link
                        href="/buscar"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 font-semibold hover:bg-[#A566FF33] px-3 py-2 rounded-lg transition"
                    >
                        🔍 Buscar por Sigla
                    </Link>

                    <Link
                        href="/endereco"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 font-semibold hover:bg-[#A566FF33] px-3 py-2 rounded-lg transition"
                    >
                        🧭 Buscar por Endereço
                    </Link>

                    <Link
                        href="/proximo"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 font-semibold hover:bg-[#A566FF33] px-3 py-2 rounded-lg transition"
                    >
                        📍 Próximo a mim
                    </Link>

                    <Link
                        href="/mapa"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 font-semibold hover:bg-[#A566FF33] px-3 py-2 rounded-lg transition"
                    >
                        🗺️ Mapa
                    </Link>

                    {/* ✅ NOVO LINK SOBRE */}
                    <Link
                        href="/sobre"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 font-semibold hover:bg-[#A566FF33] px-3 py-2 rounded-lg transition"
                    >
                        ℹ️ Sobre
                    </Link>
                </nav>

                <div className="absolute bottom-6 left-6 text-white opacity-70 text-sm">
                    © {new Date().getFullYear()} Site Radar
                </div>
            </aside>
        </>
    );
}