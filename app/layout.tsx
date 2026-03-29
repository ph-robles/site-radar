import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

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
        {/* CSS do Leaflet para o mapa */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>

      <body className={inter.className}>

        {/* HEADER */}
        <header className="bg-blue-600 text-white p-4 shadow">
          <h1 className="text-xl font-bold text-center">
            📡 Site Radar
          </h1>
        </header>

        {/* CONTEÚDO */}
        <main className="p-4 min-h-screen bg-gray-100">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="text-center text-sm text-gray-500 p-4">
          © {new Date().getFullYear()} Site Radar
        </footer>

      </body>
    </html>
  );
}