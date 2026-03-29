"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const userIcon = new L.Icon({
    iconUrl: "/user-gps.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

const erbIcon = new L.Icon({
    iconUrl: "/erb-marker.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

export default function MapaLeaflet({ lat, lon, sites }: any) {
    return (
        <MapContainer center={[lat, lon]} zoom={14} style={{ height: "500px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={[lat, lon]} icon={userIcon}>
                <Popup>📍 Você está aqui</Popup>
            </Marker>

            {sites.map((site: any, i: number) => (
                <Marker key={i} position={[site.lat, site.lon]} icon={erbIcon}>
                    <Popup>
                        <b>{site.sigla}</b><br />
                        {site.nome}<br />
                        {site.endereco}<br />

                        {`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}