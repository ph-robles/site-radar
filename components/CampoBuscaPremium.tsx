"use client";

import { useState, useEffect } from "react";

export default function CampoBuscaPremium({
    onBuscar,
}: {
    onBuscar: (valor: string) => void;
}) {
    const [valor, setValor] = useState("");
    const [debounced, setDebounced] = useState("");

    // Debounce para suavizar busca
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounced(valor);
        }, 500);
        return () => clearTimeout(timeout);
    }, [valor]);

    // Chama a busca após debounce
    useEffect(() => {
        if (debounced.trim() !== "") {
            onBuscar(debounced.trim());
        }
    }, [debounced, onBuscar]);

    return (
        <div className="w-full bg-white rounded-2xl shadow-lg border p-4 flex items-center gap-3 hover:shadow-xl transition">

            {/* Ícone */}
            <span className="text-[#7300E6] text-2xl">🔍</span>

            {/* Input */}
            <input
                type="text"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Digite a sigla da ERB (Ex: RJF001)"
                className="flex-1 outline-none text-lg text-black placeholder-gray-400"
                autoFocus
            />
        </div>
    );
}