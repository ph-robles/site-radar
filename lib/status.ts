export function getStatus(dataVencimento: string) {
    if (!dataVencimento) {
        return {
            label: "Sem data",
            color: "gray",
        };
    }

    const hoje = new Date();
    const vencimento = new Date(dataVencimento);

    const diffMs = vencimento.getTime() - hoje.getTime();
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias < 0) {
        return {
            label: "VENCIDO",
            color: "red",
        };
    }

    if (diffDias <= 30) {
        return {
            label: "⚠️ Próximo do Vencimento",
            color: "yellow",
        };
    }

    return {
        label: "OK",
        color: "green",
    };
}

export function formatarData(data: string) {
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR");
}