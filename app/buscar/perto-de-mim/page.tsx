// app/buscar/perto-de-mim/page.tsx
export const dynamic = 'force-dynamic'; // ainda recomendado para "perto de mim"

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function PertoDeMimPage({ searchParams }: Props) {
  const lat = typeof searchParams?.lat === 'string' ? searchParams.lat : undefined;
  const lng = typeof searchParams?.lng === 'string' ? searchParams.lng : undefined;

  // Validação simples
  if (!lat || !lng) {
    return (
      <section className="py-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">ERBs próximas</h2>
        <p className="text-sm text-red-600">Coordenadas não fornecidas.</p>
      </section>
    );
  }

  // Chame sua lógica server-side aqui (fetch para seu endpoint interno ou direto no DB)
  // Exemplo chamando API interna SSR (se quiser manter o mesmo endpoint):
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/sites/near?lat=${lat}&lng=${lng}&radius=5000`, {
    cache: 'no-store',
  });
  const data = res.ok ? await res.json() : { sites: [] };
  const sites = data.sites ?? [];

  return (
    <section className="py-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">ERBs próximas</h2>
      {sites.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhuma ERB encontrada neste raio.</p>
      ) : (
        <div className="mt-4 grid gap-3">
          {sites.map((s: any) => (
            // Aqui, como o componente é Server, certifique-se que SiteCard também pode ser usado em Server.
            <div key={s.id}>
              {/* substitua por <SiteCard site={s} /> se ele for compatível com Server */}
              <p className="text-sm">{s.sigla} — {s.distancia_m} m</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}