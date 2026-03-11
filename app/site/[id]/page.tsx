"use client";
 
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
 
const ErbMap = dynamic(
  () => import("@/components/ErbMap"),
  { ssr: false }
);
 
export default function SitePage() {
 
  const params = useParams();
  const id = params.id;
 
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
 
    async function carregar() {
 
      const res = await fetch(`/api/sites/${id}`);
 
      const data = await res.json();
 
      setSite(data.site);
      setLoading(false);
 
    }
 
    carregar();
 
  }, [id]);
 
  if (loading) {
    return <p className="p-10">Carregando...</p>;
  }
 
  if (!site) {
    return <p className="p-10">Site não encontrado</p>;
  }
 
  return (
 
    <section className="max-w-5xl mx-auto py-10">
 
      <h1 className="text-2xl font-bold mb-4">
        {site.sigla}
      </h1>
 
      <p className="mb-6">
        {site.nome}
      </p>
 
      <div className="h-[500px]">
 
        <ErbMap
          user={{
            lat: site.lat,
            lng: site.lon
          }}
          sites={[site]}
        />
 
      </div>
 
    </section>
 
  );
}