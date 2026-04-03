import dynamic from "next/dynamic";

// 🔥 Leaflet precisa rodar só no client
const Mapa = dynamic(() => import("./Mapa"), {
    ssr: false,
});

export default function MapaPage() {
    return <Mapa />;
}