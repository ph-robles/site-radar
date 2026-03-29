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
                className="fixed top-4 left-4 z-50 bg-[#7300E6] text-white p-3 rounded-lg shadow-md"
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

            {/* Drawer menu */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 p-6 transition-transform duration-300 transform
        ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <h2 className="text-xl font-bold mb-6 text-[#7300E6]">📡 Menu</h2>

                <nav className="flex flex-col gap-4 text-lg">

                    <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="text-[#7300E6] font-semibold hover:underline"
                    >
                        🏠 Início
                    </Link>

                    <Link
                        href="/buscar"
                        onClick={() => setOpen(false)}
                        className="text-[#7300E6] font-semibold hover:underline"
                    >
                        🔍 Buscar por Sigla
                    </Link>

                    <Link
                        href="/endereco"
                        onClick={() => setOpen(false)}
                        className="text-[#7300E6] font-semibold hover:underline"
                    >
                        🧭 Buscar por Endereço
                    </Link>

                    <Link
                        href="/proximo"
                        onClick={() => setOpen(false)}
                        className="text-[#7300E6] font-semibold hover:underline"
                    >
                        📍 Próximo a mim
                    </Link>

                    <Link
                        href="/mapa"
                        onClick={() => setOpen(false)}
                        className="text-[#7300E6] font-semibold hover:underline"
                    >
                        🗺️ Mapa
                    </Link>

                </nav>
            </aside>
        </>
    );
}