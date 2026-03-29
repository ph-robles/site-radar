'use client';

import dynamic from "next/dynamic";

// Importa dinamicamente o componente de mapa
const Mapa = dynamic(() => import("./Mapa"), {
    ssr: false, // impede renderização no servidor (evita erro window is not defined)
});

export default function Page() {
    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Mapa />
        </div>
    );
}