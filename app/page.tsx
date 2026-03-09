"use client";
import Link from "next/link";
import { useState } from "react";
import { LocateFixed, Search, Info } from "lucide-react";

export default function HomePage() {
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [errorGeo, setErrorGeo] = useState<string | null>(null);

  const handlePertoDeMim = () => {
    setErrorGeo(null);
    setLoadingGeo(true);
    if (!navigator.geolocation) {
      setErrorGeo("Geolocalização não é suportada neste navegador.");
      setLoadingGeo(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        window.location.href = `/buscar/perto-de-mim?lat=${latitude}&lng=${longitude}`;
      },
      (err) => {
        setLoadingGeo(false);
        if (err.code === err.PERMISSION_DENIED) setErrorGeo("Permissão de localização negada.");
        else if (err.code === err.POSITION_UNAVAILABLE) setErrorGeo("Localização indisponível.");
        else if (err.code === err.TIMEOUT) setErrorGeo("Tempo esgotado ao obter localização.");
        else setErrorGeo("Erro ao obter localização.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <section className="py-10">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Encontre Sites/ERBs por <span className="text-emerald-700">sigla</span>,{" "}
          <span className="text-emerald-700">endereço</span> ou{" "}
          <span className="text-emerald-700">perto de você</span>
        </h1>
        <p className="mt-3 text-gray-600">
          Rápido, simples e preciso — feito para o dia a dia do técnico em campo.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handlePertoDeMim}
            className="rounded-lg border bg-white p-5 text-left hover:shadow-md transition flex flex-col items-center gap-2"
            disabled={loadingGeo}
          >
            <LocateFixed className="w-6 h-6 text-emerald-700" />
            <div className="font-semibold">
              {loadingGeo ? "Localizando..." : "Perto de mim"}
            </div>
            <div className="text-xs text-gray-600">Usa sua localização atual</div>
          </button>

          <Link
            href="/buscar/sigla"
            className="rounded-lg border bg-white p-5 text-left hover:shadow-md transition flex flex-col items-center gap-2"
          >
            <Search className="w-6 h-6 text-emerald-700" />
            <div className="font-semibold">Buscar por sigla</div>
            <div className="text-xs text-gray-600">Ex.: RJO001, NIT-ABC</div>
          </Link>

          <Link
            href="/buscar/endereco"
            className="rounded-lg border bg-white p-5 text-left hover:shadow-md transition flex flex-col items-center gap-2"
          >
            <Search className="w-6 h-6 text-emerald-700" />
            <div className="font-semibold">Buscar por endereço</div>
            <div className="text-xs text-gray-600">Digite o endereço do cliente</div>
          </Link>
        </div>

        {errorGeo && <p className="mt-3 text-sm text-red-600">{errorGeo}</p>}

        <div className="mt-6">
          <Link href="/sobre" className="inline-flex items-center gap-1 text-sm text-gray-700 hover:underline">
            <Info className="w-4 h-4" />
            Sobre o projeto
          </Link>
        </div>
      </div>
    </section>
  );
}