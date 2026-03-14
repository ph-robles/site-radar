"use client";
 
import { useState } from "react";
import { useParams } from "next/navigation";
 
export default function AtualizarSitePage() {
 
  const params = useParams();
  const siteId = params.id;
 
  const [portas, setPortas] = useState("");
  const [obs, setObs] = useState("");
 
  async function enviar() {
 
    const res = await fetch("/api/site-update", {
      method: "POST",
      body: JSON.stringify({
        site_id: siteId,
        portas_disponiveis: portas,
        observacao: obs
      })
    });
 
    if (res.ok) {
      alert("Atualização enviada!");
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
        className="border rounded px-3 py-2 w-full mb-4"
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