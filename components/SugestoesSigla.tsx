"use client";

interface Site {
    sigla: string;
    nome: string;
    endereco: string;
}

export default function SugestoesSigla({
    termo,
    lista,
    onSelecionar,
}: {
    termo: string;
    lista: Site[];
    onSelecionar: (site: Site) => void;
}) {
    if (!termo.trim()) return null;

    // 🔥 Função de normalização
    function normalizarTexto(texto: string) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
    }

    const termoNormalizado = normalizarTexto(termo);

    // Filtra usando sigla, nome e endereço normalizados
    const resultados = lista.filter((site) => {
        const siglaNorm = normalizarTexto(site.sigla);
        const nomeNorm = normalizarTexto(site.nome);
        const endNorm = normalizarTexto(site.endereco);

        return (
            siglaNorm.includes(termoNormalizado) ||
            nomeNorm.includes(termoNormalizado) ||
            endNorm.includes(termoNormalizado)
        );
    });

    if (resultados.length === 0) return null;

    return (
        <div className="mt-2 bg-white border p-2 rounded-xl shadow-md">
            {resultados.slice(0, 5).map((site, i) => (
                <button
                    key={i}
                    onClick={() => onSelecionar(site)}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg"
                >
                    <span className="font-semibold">{site.sigla}</span> —{" "}
                    <span className="text-gray-600">{site.nome}</span>
                </button>
            ))}
        </div>
    );
}