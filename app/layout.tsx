import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Site Radar | Busca de Sites/ERBs",
  description: "Encontre ERBs por sigla, endereço ou proximidade.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}