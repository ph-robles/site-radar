export default function SobrePage() {
  return (
    <section className="py-8 max-w-3xl mx-auto prose">
      <h2>Sobre</h2>
      <p>
        O <strong>Site Radar</strong> ajuda técnicos a localizar ERBs por sigla, endereço e proximidade.
        Usa <em>PostGIS</em> no Supabase para cálculos de distância com ótimo desempenho.
      </p>
      <h3>Como funciona</h3>
      <ul>
        <li><strong>Sigla:</strong> busca com índice e ordenação inteligente.</li>
        <li><strong>Endereço:</strong> geocodifica o texto e encontra as ERBs mais próximas.</li>
        <li><strong>Perto de mim:</strong> usa sua localização (com permissão).</li>
      </ul>
      <p>
        Feito por Raphael — v1.0
      </p>
    </section>
  );
}