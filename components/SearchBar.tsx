"use client";
 
import { useState } from "react";
import { searchSites } from "@/services/sites";
 
export default function SearchBar({ onResult }: any) {
 
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
 
  async function handleSearch() {
 
    if (!query) return;
 
    const sites = await searchSites(query);
 
    setResults(sites);
  }
 
  function selectSite(site: any) {
    onResult(site);
    setResults([]);
    setQuery(site.sigla);
  }
 
  return (
 
    <div className="mb-6">
 
      <input
        type="text"
        placeholder="Digite a sigla do site (ex: RJARC)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        className="border p-2 rounded w-72"
      />
 
      <button
        onClick={handleSearch}
        className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Buscar
      </button>
 
      {results.length > 0 && (
 
        <div className="border mt-2 rounded bg-white shadow">
 
          {results.map((site) => (
 
            <div
              key={site.id}
              onClick={() => selectSite(site)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
 
              <b>{site.sigla}</b>
 
              <br />
 
              {site.nome}
 
            </div>
 
          ))}
 
        </div>
 
      )}
 
    </div>
 
  );
}
 