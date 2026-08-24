"use client";

import { useState } from "react";

export function normalizarSigla(texto: string): string {
    if (!texto) return "";

    let t = texto.toUpperCase();

    // Remove espaços
    t = t.replace(/\s+/g, "");

    // Remove caracteres especiais
    t = t.replace(/[^A-Z0-9]/g, "");

    // Remove "RJ" duplicado
    // Ex: RJRJF001 → RJF001
    while (t.startsWith("RJRJ")) {
        t = t.replace(/^RJRJ/, "RJ");
    }

    // Remove prefixo RJ se houver e se sobrar conteúdo depois
    // Ex: RJDU → DU | RJF001 → F001
    if (t.startsWith("RJ") && t.length > 2) {
        t = t.slice(2);
    }

    return t;
}

export default function CampoBuscaPremium({
    onBuscar,
}: {
    onBuscar: (valor: string) => void;
}) {
    const [valor, setValor] = useState("");

    // Remove acentos, converte para minúsculas e tira espaços extras
    function normalizarTexto(texto: string) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const original = e.target.value;
        const normalizado = normalizarTexto(original);

        setValor(original);
        onBuscar(normalizado);
    }

    return (
        <div className="w-full">
            <input
                type="text"
                placeholder="Digite nome, sigla ou endereço..."
                value={valor}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 shadow-sm text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
        </div>
    );
}