import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DrawerMenu from "@/components/DrawerMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Site Radar",
  description: "Busca de Sites/ERBs - B2B",

  openGraph: {
    title: "Site Radar",
    description:
      "Ferramenta para localizar ERBs, consultar acessos, vencimentos e registros fotográficos.",
    url: "https://site-radar.vercel.app",
    siteName: "Site Radar",
    images: [
      {
        url: "https://site-radar.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Site Radar - Localização de ERBs",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Site Radar",
    description:
      "Busca e visualização de ERBs com informações técnicas e fotos.",
    images: ["https://site-radar.vercel.app/og-image.png"],
  },

  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Leaflet */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>

      <body className={inter.className}>
        <header className="w-full bg-[#7300E6] text-white p-4 shadow-md relative">
          <h1 className="text-xl font-bold text-center">📡 Site Radar</h1>
        </header>

        <DrawerMenu />

        <main className="p-4 max-w-3xl mx-auto bg-gray-100 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}