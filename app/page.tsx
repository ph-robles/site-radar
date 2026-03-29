"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="p-4 max-w-xl mx-auto">

      {/* HEADER VISUAL PREMIUM */}
      <div className="bg-[#7300E6] text-white p-6 rounded-2xl shadow-lg mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">📡 Site Radar</h1>
        <p className="opacity-95 text-sm mt-1">
          Consulte ERBs, rotas, mapas e detalhes com visual profissional.
        </p>
      </div>

      {/* GRID DE NAVEGAÇÃO PREMIUM */}
      <div className="grid grid-cols-2 gap-4">

        {/* CARD: SIGLA */}
        <button
          onClick={() => router.push("/buscar")}
          className="bg-white shadow-md rounded-2xl p-5 flex flex-col items-center justify-center gap-2
           hover:shadow-xl active:scale-95 transition"
        >
          <span className="text-4xl">🔍</span>
          <p className="font-semibold text-[#7300E6] text-center text-lg">
            Buscar por Sigla
          </p>
        </button>

        {/* CARD: ENDEREÇO */}
        <button
          onClick={() => router.push("/endereco")}
          className="bg-white shadow-md rounded-2xl p-5 flex flex-col items-center justify-center gap-2
           hover:shadow-xl active:scale-95 transition"
        >
          <span className="text-4xl">🧭</span>
          <p className="font-semibold text-[#7300E6] text-center text-lg">
            Buscar por Endereço
          </p>
        </button>

        {/* CARD: PRÓXIMO A MIM */}
        <button
          onClick={() => router.push("/proximo")}
          className="col-span-2 bg-white shadow-md rounded-2xl p-5 flex flex-col items-center justify-center gap-2
           hover:shadow-xl active:scale-95 transition"
        >
          <span className="text-4xl">📍</span>
          <p className="font-semibold text-[#7300E6] text-center text-lg">
            ERBs Próximas
          </p>
        </button>

        {/* CARD: MAPA */}
        <button
          onClick={() => router.push("/mapa")}
          className="col-span-2 bg-white shadow-md rounded-2xl p-5 flex flex-col items-center justify-center gap-2
           hover:shadow-xl active:scale-95 transition"
        >
          <span className="text-4xl">🗺️</span>
          <p className="font-semibold text-[#7300E6] text-center text-lg">
            Mapa Geral
          </p>
        </button>
      </div>

      {/* RODAPÉ MODERNO */}
      <div className="text-center text-gray-500 text-sm mt-8">
        Desenvolvido por Raphael Robles • {new Date().getFullYear()}
      </div>
    </main>
  );
}