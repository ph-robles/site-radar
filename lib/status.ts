// ===============================
// Formata a data para DD/MM/AA
// ===============================
export function formatarData(data: string) {
    const d = new Date(data);

    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = String(d.getFullYear()).slice(2); // 2 últimos dígitos

    return `${dia}/${mes}/${ano}`;
}

// ===============================
// Status SIMPLES (legado)
// ===============================
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

// ===============================
// Status PREMIUM (com textos e dias restantes)
// ===============================
export function getStatusPremium(dataVencimento: string) {
    if (!dataVencimento) {
        return {
            label: "Sem data",
            color: "gray",
            dias: 0,
            mensagem: "Sem informação de vencimento",
        };
    }

    const hoje = new Date();
    const venc = new Date(dataVencimento);

    const diffMs = venc.getTime() - hoje.getTime();
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Já está vencido
    if (diffDias < 0) {
        return {
            label: "VENCIDO",
            color: "red",
            dias: diffDias,
            mensagem: `❌ Vencido há ${Math.abs(diffDias)} dias`,
        };
    }

    // Faltam 30 dias ou menos
    if (diffDias <= 30) {
        return {
            label: "PRÓXIMO",
            color: "yellow",
            dias: diffDias,
            mensagem: `⚠ Vence em ${diffDias} dias`,
        };
    }

    // Normal
    return {
        label: "OK",
        color: "green",
        dias: diffDias,
        mensagem: `✔ Dentro da validade`,
    };
}