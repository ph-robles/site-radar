import "./globals.css";
import Navbar from "@/components/Navbar";
 
export const metadata = {
  title: "Site Radar",
  description: "Busca de Sites / ERBs",
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
 
        <Navbar />
 
        <main className="max-w-6xl mx-auto p-6">
          {children}
        </main>
 
      </body>
    </html>
  );
}
 