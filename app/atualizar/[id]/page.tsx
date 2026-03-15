"use client";
 
import { useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
 
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
 
export default function AtualizarSitePage() {
 
  const params = useParams();
  const siteId = params.id;
 
  const [portas, setPortas] = useState("");
  const [obs, setObs] = useState("");
 
  const [fotoLocal, setFotoLocal] = useState<File | null>(null);
  const [fotoCadeado, setFotoCadeado] = useState<File | null>(null);
  const [fotoPortas, setFotoPortas] = useState<File | null>(null);
 
  async function uploadFoto(file: File, pasta: string) {
 
    const nome = `${Date.now()}-${file.name}`;
 
    const { data, error } = await supabase.storage
      .from("site-fotos")
      .upload(`${pasta}/${nome}`, file);
 
    if (error) {
      console.error(error);
      return null;
    }
 
    const { data: urlData } = supabase
      .storage
      .from("site-fotos")
      .getPublicUrl(`${pasta}/${nome}`);
 
    return urlData.publicUrl;
  }
 
  async function enviar() {
 
    let urlLocal = null;
    let urlCadeado = null;
    let urlPortas = null;
 
    if (fotoLocal) {
      urlLocal = await uploadFoto(fotoLocal, `site-${siteId}`);
    }
 
    if (fotoCadeado) {
      urlCadeado = await uploadFoto(fotoCadeado, `site-${siteId}`);
    }
 
    if (fotoPortas) {
      urlPortas = await uploadFoto(fotoPortas, `site-${siteId}`);
    }
 
    const res = await fetch("/api/site-update", {
      method: "POST",
      body: JSON.stringify({
        site_id: siteId,
        portas_disponiveis: portas,
        observacao: obs,
        foto_local: urlLocal,
        foto_cadeado: urlCadeado,
        foto_portas: urlPortas
      })
    });
 
    if (res.ok) {
      alert("Atualização enviada com sucesso!");
    } else {
      alert("Erro ao salvar");
    }
 
  }
 
  return (
 
    <section className="max-w-xl mx-auto py-10">
 
      <h1 className="text-2xl font-bold mb-6">
        Atualizar informações do site
      </h1>
 
      <label className="block mb-2">
        Portas disponíveis
      </label>
 
      <input
        value={portas}
        onChange={(e)=>setPortas(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-4"
      />
 
      <label className="block mb-2">
        Observações
      </label>
 
      <textarea
        value={obs}
        onChange={(e)=>setObs(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-6"
      />
 
      <label className="block mb-2">
        📷 Foto do local
      </label>
 
      <input
        type="file"
        onChange={(e)=>setFotoLocal(e.target.files?.[0] || null)}
        className="mb-4"
      />
 
      <label className="block mb-2">
        🔒 Foto do cadeado
      </label>
 
      <input
        type="file"
        onChange={(e)=>setFotoCadeado(e.target.files?.[0] || null)}
        className="mb-4"
      />
 
      <label className="block mb-2">
        🚪 Foto das portas
      </label>
 
      <input
        type="file"
        onChange={(e)=>setFotoPortas(e.target.files?.[0] || null)}
        className="mb-6"
      />
 
      <button
        onClick={enviar}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Enviar atualização
      </button>
 
    </section>
 
  );
}