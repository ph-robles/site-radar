"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    buscarFotosPorSigla,
    uploadFoto,
    deletarFoto,
    contarFotos,
    MAX_FOTOS,
} from "@/services/fotos";

type TouchPoint = {
    clientX: number;
    clientY: number;
};

const ADMIN_EMAIL = "raphaelrobles22@hotmail.com";

export default function FotoGaleria({
    sigla,
    endereco,
}: {
    sigla: string;
    endereco: string;
}) {
    const [fotos, setFotos] = useState<any[]>([]);
    const [fotoAberta, setFotoAberta] = useState<any | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user?.email === ADMIN_EMAIL) setIsAdmin(true);
        });
    }, []);

    async function carregar() {
        const data = await buscarFotosPorSigla(sigla);
        setFotos(data);
    }

    useEffect(() => {
        carregar();
    }, [sigla]);

    function formatarData(data: string) {
        return new Date(data).toLocaleString("pt-BR");
    }

    async function handleDelete(id: string, path: string) {
        if (!isAdmin) return;
        if (!confirm("Remover esta foto?")) return;
        await deletarFoto(id, path);
        await carregar();
    }

    return (
        <div className="mt-4">
            <p className="font-semibold text-sm mb-2">📸 Fotos da ERB</p>

            <div className="grid grid-cols-3 gap-2">
                {fotos.map((f) => (
                    <button
                        key={f.id}
                        type="button"
                        onClick={() => setFotoAberta(f)}
                        className="relative rounded overflow-hidden focus:outline-none"
                    >
                        <img
                            src={f.url}
                            alt="Foto da ERB"
                            className="w-full h-24 object-cover"
                            loading="lazy"
                        />

                        <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] p-1 backdrop-blur">
                            <p className="font-bold">{sigla}</p>
                            <p className="truncate">{endereco}</p>
                            <p>📅 {formatarData(f.criado_em)}</p>
                        </div>

                        {isAdmin && (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(f.id, f.path);
                                }}
                                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded cursor-pointer"
                            >
                                ✕
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {fotoAberta && (
                <ZoomModal
                    foto={fotoAberta}
                    sigla={sigla}
                    endereco={endereco}
                    onClose={() => setFotoAberta(null)}
                />
            )}
        </div>
    );
}

/* -------------------- MODAL ESTÁVEL COM ZOOM -------------------- */

function ZoomModal({
    foto,
    sigla,
    endereco,
    onClose,
}: {
    foto: any;
    sigla: string;
    endereco: string;
    onClose: () => void;
}) {
    const [loaded, setLoaded] = useState(false);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        setScale(1);
        setLoaded(false);
    }, [foto]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
            >
                {!loaded && (
                    <div className="text-white text-sm absolute inset-0 flex items-center justify-center">
                        Carregando imagem…
                    </div>
                )}

                <img
                    src={foto.url}
                    alt="Foto ampliada"
                    onLoad={() => setLoaded(true)}
                    className="max-w-screen max-h-screen select-none"
                    style={{ transform: `scale(${scale})` }}
                    draggable={false}
                    onWheelCapture={(e) => {
                        e.preventDefault();
                        const delta = e.deltaY < 0 ? 1.15 : 0.9;
                        setScale((s) => Math.min(Math.max(s * delta, 1), 4));
                    }}
                />

                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs p-3 rounded backdrop-blur">
                    <p className="font-bold">{sigla}</p>
                    <p>{endereco}</p>
                    <p>📅 {new Date(foto.criado_em).toLocaleString("pt-BR")}</p>
                </div>

                <button
                    className="absolute top-4 right-4 text-white text-2xl"
                    onClick={onClose}
                >
                    ✕
                </button>
            </div>
        </div>
    );
}