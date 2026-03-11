"use client";
 
import Link from "next/link";
 
export default function SiteCard({ site }: any) {
 
  return (
 
    <Link href={`/site/${site.id}`}>
 
      <div className="border rounded p-4 hover:bg-gray-50 cursor-pointer">
 
        <h2 className="font-semibold text-lg">
          {site.sigla}
        </h2>
 
        <p className="text-sm text-gray-600">
          {site.nome}
        </p>
 
        <p className="text-sm">
          {site.endereco}
        </p>
 
      </div>
 
    </Link>
 
  );
}