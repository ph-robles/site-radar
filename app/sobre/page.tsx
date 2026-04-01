export default function SobrePage() {
    return (
        <main className="p-6 max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-extrabold text-[#7300E6]">
                Sobre o Site Radar
            </h1>

            <p className="text-gray-700 text-lg">
                O <strong>Site Radar</strong> é uma ferramenta desenvolvida para apoiar
                técnicos de campo, manutenção e operações na localização rápida e
                consulta de informações de ERBs, sites técnicos e pontos de acesso.
            </p>

            <section className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900">🎯 Objetivo</h2>
                <p className="text-gray-700">
                    Centralizar informações essenciais como localização, acesso,
                    retirada de chaves, vencimentos e registros fotográficos em um único
                    lugar, facilitando o trabalho em campo e reduzindo erros operacionais.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900">🧰 Funcionalidades</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Busca de ERBs por sigla</li>
                    <li>Visualização de sites no mapa</li>
                    <li>Consulta de informações de acesso</li>
                    <li>Controle de vencimentos</li>
                    <li>Galeria de fotos por ERB</li>
                    <li>Registro visual para apoio em campo</li>
                </ul>
            </section>

            <section className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900">👷 Público-alvo</h2>
                <p className="text-gray-700">
                    Técnicos de campo, equipes de manutenção, supervisores e gestores que
                    precisam de acesso rápido e confiável às informações dos sites.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900">🚀 Evolução</h2>
                <p className="text-gray-700">
                    O Site Radar está em constante evolução, recebendo melhorias como
                    histórico fotográfico, controle de acessos, relatórios e novas formas
                    de visualização dos dados.
                </p>
            </section>

            <footer className="pt-6 border-t text-sm text-gray-500">
                Desenvolvido por Raphael Robles para uso interno e apoio operacional.
            </footer>
        </main>
    );
}