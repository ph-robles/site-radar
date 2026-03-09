"use client";
import Link from "next/link";
import { MapPin, Search, Home, Info } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-50">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <span>Site Radar</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="inline-flex items-center gap-1 hover:underline">
            <Home className="w-4 h-4" /> Início
          </Link>
          <Link href="/buscar/sigla" className="inline-flex items-center gap-1 hover:underline">
            <Search className="w-4 h-4" /> Sigla
          </Link>
          <Link href="/buscar/endereco" className="inline-flex items-center gap-1 hover:underline">
            <Search className="w-4 h-4" /> Endereço
          </Link>
          <Link href="/sobre" className="inline-flex items-center gap-1 hover:underline">
            <Info className="w-4 h-4" /> Sobre
          </Link>
        </nav>
      </div>
    </header>
  );
}