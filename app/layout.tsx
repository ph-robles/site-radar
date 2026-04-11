import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Site Radar",
  description: "Consulte ERBs, rotas, mapas e detalhes técnicos dos sites.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Site Radar",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ServiceWorkerRegister />

        <header className="bg-violet-700 text-white p-4 shadow">
          <h1 className="text-xl font-bold text-center">📡 Site Radar</h1>
        </header>

        <main className="p-4 min-h-screen bg-gray-100">{children}</main>

        <footer className="text-center text-sm text-gray-500 p-4">
          © {new Date().getFullYear()} Site Radar
        </footer>
      </body>
    </html>
  );
}
