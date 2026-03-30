"use client";

import { useEffect, useState } from "react";

function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // retorna KM
}

export default function DistanciaCliente({
    lat,
    lon,
}: {
    lat: number;
    lon: number;
}) {
    const [distancia, setDistancia] = useState<string>("Calculando...");

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latUser = position.coords.latitude;
                const lonUser = position.coords.longitude;

                const km = calcularDistancia(latUser, lonUser, lat, lon);
                const metros = km * 1000;

                if (metros < 1000) {
                    setDistancia(`${Math.round(metros)} metros`);
                } else {
                    setDistancia(`${km.toFixed(2)} km`);
                }
            },
            () => {
                setDistancia("Localização não permitida");
            }
        );
    }, [lat, lon]);

    return (
        <p className="text-black font-semibold text-lg mt-2">
            📏 Distância até você: {distancia}
        </p>
    );
}