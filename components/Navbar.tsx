"use client";
 
import Link from "next/link";
 
export default function Navbar() {
  return (
    <nav className="w-full bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
 
      <div className="font-bold text-lg">
        📡 Site Radar
      </div>
 
      <div className="flex gap-6">
 
        <Link href="/">
          Home
        </Link>
 
        <Link href="/buscar">
          Buscar
        </Link>
 
        <Link href="/mapa">
          Mapa
        </Link>
 
        <Link href="/dashboard">
          Dashboard
        </Link>
 
      </div>
 
    </nav>
  );
}