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

    // Caso digite só 3 letras — "dju", "f01" → ok
    return t;
}


export default function CampoBuscaPremium({ onBuscar }: { onBuscar: (valor: string) => void }) {
    const [valor, setValor] = useState("");

    // 🔥 Função de normalização: remove acentos, converte para minúsculas e tira espaços extras
    function normalizarTexto(texto: string) {
        return texto
            .normalize("NFD")                     // separa acentos
            .replace(/[\u0300-\u036f]/g, "")      // remove acentos
            .toLowerCase()                        // deixa tudo minúsculo
            .replace(/\s+/g, " ")                 // remove espaços duplicados
            .trim();                              // remove espaços nas pontas
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const original = e.target.value;
        const normalizado = normalizarTexto(original);

        setValor(original);       // mantém o que o usuário digita
        onBuscar(normalizado);    // envia a versão normalizada para a busca
    }

    return (
        <div className="w-full">
            <input
                type="text"
                placeholder="Digite nome, sigla ou endereço..."
                value={valor}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
        </div>
    );
}