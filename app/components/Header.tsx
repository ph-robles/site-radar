"use client";
import Link from "next/link";
import { MapPin, Search, Home } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-50">
      <div className="container flex items-center justify-between h-14">
        /
          <MapPin className="w-5 h-5 text-emerald-600" />
          <span>Site Radar</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          /
            <Home className="w-4 h-4" /> Início
          </Link>
          /buscar/sigla
            <Search className="w-4 h-4" /> Sigla
          </Link>
          /buscar/enderecoEndereço</Link>
          /sobreSobre</Link>
        </nav>
      </div>
    </header>
  );
}