export function getStatus(data: string) {
    const hoje = new Date();
    const vencimento = new Date(data);

    const diff = Math.ceil(
        (vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0) return { label: "Vencido", color: "red" };
    if (diff <= 30) return { label: "Próximo", color: "yellow" };

    return { label: "OK", color: "green" };
}