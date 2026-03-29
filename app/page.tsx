"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main style={{ maxWidth: 960, margin: "24px auto", padding: 16 }}>

      {/* Logo */}
      <div style={{ marginBottom: 8 }}>
        <Image
          src="/logo.png"
          width={220}
          height={80}
          alt="Logo"
          priority
        />
      </div>

      <h1>📡 Localizar Site/ERB</h1>
      <h3>Selecione uma opção abaixo:</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 16,
        }}
      >
        <button className="btn" onClick={() => router.push("/buscar")}>
          🔍 Buscar por SIGLA
        </button>
        <button className="btn" onClick={() => router.push("/endereco")}>
          🧭 Buscar por ENDEREÇO
        </button>
        <button
          className="btn"
          onClick={() => router.push("/proximo")}
        >
          📍 Próximo a mim
        </button>
      </div>

      <hr style={{ margin: "24px 0" }} />

      <div style={{ textAlign: "center", color: "#666" }}>
        ❤️ Desenvolvido por Raphael Robles — © 2026 • 🚀{" "}
        <a
          href="https://busca-sites-b2b.streamlit.app/Sobre"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sobre o App TowerLink
        </a>
      </div>
    </main>
  );
}