"use client";

export default function BotoesPremium({ lat, lon }: { lat: number; lon: number }) {

    function copiarCoordenadas() {
        navigator.clipboard.writeText(`${lat}, ${lon}`);
        alert("Coordenadas copiadas!");
    }

    const urlMapa = `https://www.google.com/maps?q=${lat},${lon}`;
    const urlRota = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

    return (
        <div className="grid grid-cols-2 gap-3 mt-4">

            <a
                href={urlMapa}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7300E6] text-white py-3 rounded-xl text-center font-semibold shadow hover:bg-[#4B0099] transition"
            >
                📍 Ver no Mapa
            </a>

            <a
                href={urlRota}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#A566FF] text-white py-3 rounded-xl text-center font-semibold shadow hover:bg-[#7300E6] transition"
            >
                🚗 Rota
            </a>

            <button
                onClick={copiarCoordenadas}
                className="col-span-2 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold shadow hover:bg-gray-300 transition"
            >
                📋 Copiar Coordenadas
            </button>

        </div>
    );
}