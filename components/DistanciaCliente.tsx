"use client";

import { useEffect, useState } from "react";

function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
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
            (pos) => {
                const latUser = pos.coords.latitude;
                const lonUser = pos.coords.longitude;

                const d = calcularDistancia(latUser, lonUser, lat, lon);

                setDistancia(d.toFixed(2) + " km");
            },
            () => {
                setDistancia("Localização não permitida");
            }
        );
    }, [lat, lon]);

    return (
        <p className="text-gray-800 font-semibold text-lg">
            📏 Distância até você: {distancia}
        </p>
    );
}