"use client";

import { useEffect, useRef, useState } from "react";
import {
    buscarFotosPorSigla,
    uploadFoto,
    deletarFoto,
    contarFotos,
    MAX_FOTOS,
} from "@/services/fotos";

/* ─────────────────────────────────────────────────────────── */
/* Tipagem correta para Touch (React + DOM friendly)           */
/* ─────────────────────────────────────────────────────────── */
type TouchPoint = {
    clientX: number;
    clientY: number;
};

export default function FotoGaleria({ sigla }: { sigla: string }) {
    const [fotos, setFotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fotoAberta, setFotoAberta] = useState<string | null>(null);

    async function carregar() {
        const data = await buscarFotosPorSigla(sigla);
        setFotos(data);
    }

    useEffect(() => {
        carregar();
    }, [sigla]);

    async function handleUpload(file: File) {
        setLoading(true);
        try {
            const total = await contarFotos(sigla);
            if (total >= MAX_FOTOS) {
                alert("Limite de 3 fotos atingido.");
                return;
            }
            await uploadFoto(sigla, file);
            await carregar();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string, path: string) {
        if (!confirm("Remover esta foto?")) return;
        await deletarFoto(id, path);
        await carregar();
    }

    return (
        <div className="mt-4">
            <p className="font-semibold text-sm mb-2">📸 Fotos da ERB</p>

            {/* GRID */}
            <div className="grid grid-cols-3 gap-2">
                {fotos.map((f) => (
                    <div key={f.id} className="relative group">
                        <img
                            src={f.url}
                            alt="Foto da ERB"
                            className="w-24 h-24 object-cover rounded cursor-pointer"
                            onClick={() => setFotoAberta(f.url)}
                        />

                        <button
                            onClick={() => handleDelete(f.id, f.path)}
                            className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded hidden group-hover:block"
                        >
                            ✕
                        </button>
                    </div>
                ))}

                {fotos.length < MAX_FOTOS && (
                    <label className="w-24 h-24 border-dashed border-2 rounded flex items-center justify-center text-sm cursor-pointer">
                        +
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            hidden
                            disabled={loading}
                            onChange={(e) =>
                                e.target.files && handleUpload(e.target.files[0])
                            }
                        />
                    </label>
                )}
            </div>

            {/* MODAL COM ZOOM */}
            {fotoAberta && (
                <ZoomModal src={fotoAberta} onClose={() => setFotoAberta(null)} />
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────── */
/* Modal com Zoom + Pinch + Pan                                */
/* ─────────────────────────────────────────────────────────── */
function ZoomModal({
    src,
    onClose,
}: {
    src: string;
    onClose: () => void;
}) {
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const lastTouch = useRef<TouchPoint | null>(null);
    const lastDistance = useRef<number | null>(null);
    const dragging = useRef(false);
    const lastMouse = useRef({ x: 0, y: 0 });

    function distance(t1: TouchPoint, t2: TouchPoint) {
        return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    }

    /* ───────────── TOUCH (PINCH + PAN) ───────────── */
    function onTouchStart(e: React.TouchEvent) {
        if (e.touches.length === 2) {
            lastDistance.current = distance(e.touches[0], e.touches[1]);
        } else if (e.touches.length === 1) {
            lastTouch.current = {
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY,
            };
        }
    }

    function onTouchMove(e: React.TouchEvent) {
        if (e.touches.length === 2 && lastDistance.current) {
            const d = distance(e.touches[0], e.touches[1]);
            const delta = d / lastDistance.current;
            setScale((s) => Math.min(Math.max(s * delta, 1), 4));
            lastDistance.current = d;
        } else if (e.touches.length === 1 && scale > 1 && lastTouch.current) {
            const dx = e.touches[0].clientX - lastTouch.current.clientX;
            const dy = e.touches[0].clientY - lastTouch.current.clientY;
            setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
            lastTouch.current = {
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY,
            };
        }
    }

    function onTouchEnd() {
        lastDistance.current = null;
        lastTouch.current = null;
    }

    /* ───────────── MOUSE (DESKTOP) ───────────── */
    function onWheel(e: React.WheelEvent) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 1.1 : 0.9;
        setScale((s) => Math.min(Math.max(s * delta, 1), 4));
    }

    function onMouseDown(e: React.MouseEvent) {
        dragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseMove(e: React.MouseEvent) {
        if (!dragging.current || scale <= 1) return;
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
        lastMouse.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseUp() {
        dragging.current = false;
    }

    return (
        <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center touch-none"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 text-white text-2xl z-50"
                onClick={onClose}
            >
                ✕
            </button>

            <img
                src={src}
                alt="Foto ampliada"
                className="max-w-full max-h-full select-none"
                style={{
                    transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                    transition: dragging.current ? "none" : "transform 0.1s ease-out",
                }}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onWheel={onWheel}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                draggable={false}
            />
        </div>
    );
}
``