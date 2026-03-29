"use client";

import { useState } from "react";
import Link from "next/link";

export default function MenuLateral() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Botão de menu */}
            <button
                onClick={() => setOpen(true)}
                className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg"
            >
                ☰
            </button>

            {/* Fundo escuro */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => setOpen(false)}
                ></div>
            )}

            {/* Menu lateral */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 p-6 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <h2 className="text-xl font-bold mb-4">📡 Menu</h2>

                <nav className="flex flex-col gap-4 text-lg">
                    <Link href="/" onClick={() => setOpen(false)}>🏠 Início</Link>
                    <Link href="/buscar" onClick={() => setOpen(false)}>🔍 Buscar por Sigla</Link>
                    <Link href="/endereco" onClick={() => setOpen(false)}>🧭 Buscar por Endereço</Link>
                    <Link href="/proximo" onClick={() => setOpen(false)}>📍 Próximo a mim</Link>
                    <Link href="/mapa" onClick={() => setOpen(false)}>🗺️ Mapa</Link>
                </nav>
            </aside>
        </>
    );
}