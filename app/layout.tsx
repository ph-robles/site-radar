"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Site Radar",
  description: "Controle de vencimento de ERBs",
};

function MenuLateral() {
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

      {/* Fundo escurecido */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        ></div>
      )}

      {/* Menu lateral */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 p-6 transition-transform ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <h2 className="text-xl font-bold mb-4">📡 Menu</h2>

        <nav className="flex flex-col gap-3">
          <Link href="/">🏠 Início</Link>
          <Link href="/buscar">🔍 Buscar por Sigla</Link>
          <Link href="/endereco">🧭 Buscar por Endereço</Link>
          <Link href="/proximo">📍 Próximo a mim</Link>
          <Link href="/mapa">🗺️ Mapa</Link>
        </nav>
      </aside>
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* CSS do Leaflet */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>

      <body className={inter.className}>
        <MenuLateral />

        <main className="p-4 max-w-3xl mx-auto min-h-screen bg-gray-100">
          {children}
        </main>
      </body>
    </html>
  );
}