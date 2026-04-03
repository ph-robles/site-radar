import dynamic from "next/dynamic";

const Mapa = dynamic(() => import("./Mapa"), {
    ssr: false,
});

export default function MapaPage() {
    return <Mapa />;
}
