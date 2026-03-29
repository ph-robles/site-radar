"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="p-4 max-w-xl mx-auto">

      {/* HEADER VISUAL */}
      <div className="bg-[var(--vivo-primary)] text-white p-6 rounded-2xl shadow-lg mb-6">
        <h1 className="text-3xl font-bold">📡 Site Radar</h1>
        <p className="opacity-90 mt-1">
          Localize ERBs, veja rotas e informações com rapidez.
        </p>
      </div>

      {/* GRID DE NAVEGAÇÃO */}
      <div className="grid grid-cols-2 gap-4">

        {/* Buscar por Sigla */}
        <div
          onClick={() => router.push("/buscar")}
          className="bg-white shadow-md rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-xl transition"
        >
          <span className="text-4xl">🔍</span>
          <p className="font-semibold text-[var(--vivo-primary)] text-center">
            Buscar por Sigla
          </p>
        </div>

        {/* Buscar por Endereço */}
        <div
          onClick={() => router.push("/endereco")}
          className="bg-white shadow-md rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-xl transition"
        >
          <span className="text-4xl">🧭</span>
          <p className="font-semibold text-[var(--vivo-primary)] text-center">
            Buscar por Endereço
          </p>
        </div>

        {/* Próximo a mim */}
        <div
          onClick={() => router.push("/proximo")}
          className="bg-white shadow-md rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-xl transition col-span-2"
        >
          <span className="text-4xl">📍</span>
          <p className="font-semibold text-[var(--vivo-primary)] text-center">
            ERBs Próximas
          </p>
        </div>

        {/* Mapa */}
        <div
          onClick={() => router.push("/mapa")}
          className="bg-white shadow-md rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-xl transition col-span-2"
        >
          <span className="text-4xl">🗺️</span>
          <p className="font-semibold text-[var(--vivo-primary)] text-center">
            Mapa Geral
          </p>
        </div>
      </div>

    </main>
  );
}