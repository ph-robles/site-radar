"use client";

import { useEffect, useRef } from "react";
import { buscarTodosSitesParaMapa } from "@/services/sites";

let mapInstance: any = null;

export default function MapaLeaflet() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!containerRef.current) return;

        let isMounted = true;

        async function initMap() {
            const L = (await import("leaflet")).default;

            if (!isMounted) return;

            if (mapInstance) {
                try { mapInstance.remove(); } catch (_) { }
                mapInstance = null;
            }

            const container = containerRef.current as any;
            if (!container || container._leaflet_id) return;

            const map = L.map(container, {
                zoomControl: true,
                preferCanvas: false,
            }).setView([-22.9, -43.17], 11);

            mapInstance = map;

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "© OpenStreetMap",
            }).addTo(map);

            // ── Ícone SVG com sigla embaixo ───────────────────────────────────────
            function criarIcone(sigla: string, capacitado: string | null) {
                const isCap =
                    capacitado?.toLowerCase() === "sim" ||
                    capacitado?.toLowerCase() === "s" ||
                    capacitado === "1" ||
                    capacitado === "true";

                const cor = isCap ? "#7C3AED" : "#6B7280";

                const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
          <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="${cor}"/>
          <circle cx="18" cy="17" r="9" fill="white"/>
          <circle cx="18" cy="17" r="3" fill="${cor}"/>
          <path d="M11 11 Q18 6 25 11" stroke="${cor}" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M13 14 Q18 10 23 14" stroke="${cor}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </svg>`;

                return L.divIcon({
                    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
            ${svg}
            <span style="background:${cor};color:white;font-size:9px;font-weight:700;
              padding:1px 6px;border-radius:99px;white-space:nowrap;
              box-shadow:0 1px 3px rgba(0,0,0,0.25);font-family:system-ui,sans-serif;">
              ${sigla}
            </span>
          </div>`,
                    className: "",
                    iconSize: [60, 62],
                    iconAnchor: [30, 44],
                    popupAnchor: [0, -46],
                });
            }

            // ── Busca ERBs e plota ────────────────────────────────────────────────
            try {
                const sites = await buscarTodosSitesParaMapa();
                if (!isMounted) return;

                sites.forEach((site: any) => {
                    if (!site.lat || !site.lon) return;

                    const isCap =
                        site.capacitado?.toLowerCase() === "sim" ||
                        site.capacitado?.toLowerCase() === "s" ||
                        site.capacitado === "1" ||
                        site.capacitado === "true";

                    const marker = L.marker([site.lat, site.lon], {
                        icon: criarIcone(site.sigla, site.capacitado),
                    });

                    marker.bindPopup(`
            <div style="font-family:system-ui,sans-serif;min-width:190px;">
              <p style="font-size:15px;font-weight:700;color:#1f2937;margin:0 0 4px;">
                📡 ${site.sigla}
              </p>
              <p style="font-size:12px;color:#6b7280;margin:0 0 8px;line-height:1.4;">
                ${site.endereco ?? "Endereço não informado"}
              </p>
              <span style="display:inline-block;padding:2px 10px;border-radius:99px;
                font-size:11px;font-weight:600;
                background:${isCap ? "#7C3AED" : "#6B7280"};color:white;">
                ${isCap ? "✅ Capacitado" : "⬜ Não capacitado"}
              </span>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}"
                target="_blank"
                style="display:block;text-align:center;background:#16a34a;color:white;
                  padding:6px;border-radius:8px;text-decoration:none;font-size:12px;
                  font-weight:600;margin-top:10px;">
                🧭 Rota até aqui
              </a>
            </div>`, { maxWidth: 240 });

                    marker.addTo(map);
                });

                // Ajusta zoom para mostrar todos os pins
                const validos = sites.filter((s: any) => s.lat && s.lon);
                if (validos.length > 0) {
                    map.fitBounds(
                        L.latLngBounds(validos.map((s: any) => [s.lat, s.lon])),
                        { padding: [40, 40], maxZoom: 13 }
                    );
                }
            } catch (err) {
                console.error("Erro ao carregar ERBs:", err);
            }
        }

        initMap();

        return () => {
            isMounted = false;
            if (mapInstance) {
                try { mapInstance.remove(); } catch (_) { }
                mapInstance = null;
            }
        };
    }, []);

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>

            {/* Legenda */}
            <div style={{
                position: "absolute", bottom: 24, left: 12, zIndex: 1000,
                background: "white", borderRadius: 12, padding: "8px 14px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                fontSize: 12, fontFamily: "system-ui,sans-serif",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#7C3AED" }} />
                    <span>Capacitado</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#6B7280" }} />
                    <span>Não capacitado</span>
                </div>
            </div>

            <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
}