import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MenuLateral from "@/components/MenuLateral";

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
        <MenuLateral />

        <main className="p-4 max-w-3xl mx-auto min-h-screen bg-gray-100">
          {children}
        </main>
      </body>
    </html>
  );
}