"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Loader from "@/components/Loader";
import { buscarSitesProximos } from "@/services/sites";

// Ícone profissional do usuário
const userIcon = new L.Icon({
    iconUrl: "/user-gps.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

// Ícone ERB
const erbIcon = new L.Icon({
    iconUrl: "/erb-marker.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

export default function MapaPage() {
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const [sites, setSites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const userLat = pos.coords.latitude;
                const userLon = pos.coords.longitude;

                setLat(userLat);
                setLon(userLon);

                const resultado = await buscarSitesProximos(userLat, userLon);
                setSites(resultado);

                setLoading(false);
            },
            () => {
                alert("Permita o acesso à localização");
                setLoading(false);
            }
        );
    }, []);

    if (loading) return <Loader />;

    if (!lat || !lon) return <p className="text-red-500">Sem localização</p>;

    return (
        <main className="p-4 max-w-3xl mx-auto">
            <h1 className="text-xl font-bold mb-4">🗺️ Mapa das ERBs Próximas</h1>

            <MapContainer center={[lat, lon]} zoom={14}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Marker do usuário */}
                <Marker position={[lat, lon]} icon={userIcon}>
                    <Popup>📍 Você está aqui</Popup>
                </Marker>

                {/* Markers das ERBs */}
                {sites.map((site, i) => (
                    <Marker key={i} position={[site.lat, site.lon]} icon={erbIcon}>
                        <Popup>
                            <b>{site.sigla}</b> <br />
                            {site.nome} <br />
                            {site.endereco} <br />
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`}
                                target="_blank"
                                className="text-blue-600 underline"
                            >
                                Abrir rota
                            </a>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </main>
    );
}