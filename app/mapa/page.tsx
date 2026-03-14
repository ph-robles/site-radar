"use client";
 
import dynamic from "next/dynamic";
 
const MapView = dynamic(
  () => import("@/components/MapView"),
  { ssr: false }
);
 
export default function MapaPage() {
  return (
    <div>
 
      <h1 className="text-3xl font-bold mb-6">
        🗺️ Mapa de Sites
      </h1>
 
      <MapView />
 
    </div>
  );
}