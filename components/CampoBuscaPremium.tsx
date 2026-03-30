"use client";

import { useState } from "react";

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