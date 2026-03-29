import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DrawerMenu from "@/components/DrawerMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Site Radar",
  description: "Controle de vencimento de ERBs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
      </head>

      <body className={inter.className}>
        {/* Header */}
        <header className="w-full bg-[#7300E6] text-white p-4 shadow-md relative">
          <h1 className="text-xl font-bold text-center">📡 Site Radar</h1>
        </header>

        {/* Menu */}
        <DrawerMenu />

        {/* Conteúdo */}
        <main className="p-4 max-w-3xl mx-auto bg-gray-100 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}