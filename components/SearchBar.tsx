"use client";
 
import { useState } from "react";
import { searchSiteBySigla } from "@/services/sites";
 
export default function SearchBar({ onResult }: any) {
 
  const [sigla, setSigla] = useState("");
 
  async function handleSearch() {
 
    const site = await searchSiteBySigla(sigla.trim());
 
    if (site) {
      onResult(site);
    } else {
      alert("Site não encontrado");
    }
 
  }
 
  return (
 
    <div className="flex gap-2 mb-6">
 
      <input
        type="text"
        placeholder="Digite a sigla do site"
        value={sigla}
        onChange={(e) => setSigla(e.target.value)}
        className="border p-2 rounded w-64"
      />
 
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Buscar
      </button>
 
    </div>
 
  );
}
 