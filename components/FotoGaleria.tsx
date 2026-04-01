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

/* Tipagem mínima */
type TouchPoint = {
    clientX: number;
    clientY: number;
};

const ADMIN_EMAIL = "raphael@seudominio.com";

export default function FotoGaleria({
    sigla,
    endereco,
}: {
    sigla: string;
    endereco: string;
}) {
    const [fotos, setFotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fotoAberta, setFotoAberta] = useState<any | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    /* Verifica admin */
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
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string, path: string) {
        if (!isAdmin) return;
        if (!confirm("Remover esta foto?")) return;
        await deletarFoto(id, path);
        await carregar();
    }

    function formatarData(data: string) {
        return new Date(data).toLocaleString("pt-BR");
    }

    return (
        <div className="mt-4">
            <p className="font-semibold text-sm mb-2">📸 Fotos da ERB</p>

            {/* GRID */}
            <div className="grid grid-cols-3 gap-2">
                {fotos.map((f) => (
                    <div
                        key={f.id}
                        className="relative rounded overflow-hidden cursor-pointer"
                        onClick={() => setFotoAberta(f)}
                    >
                        {/* ✅ IMAGEM CORRETA */}
                        <img
                            src={f.url}
                            alt={`Foto ERB ${sigla}`}
                            className="w-full h-24 object-cover"
                        />

                        {/* ✅ OVERLAY */}
                        <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] p-1 backdrop-blur">
                            <p className="font-bold">{sigla}</p>
                            <p className="truncate">{endereco}</p>
                            <p>📅 {formatarData(f.criado_em)}</p>
                        </div>

                        {/* DELETE ADMIN */}
                        {isAdmin && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(f.id, f.path);
                                }}
                                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
                            >
                                ✕
                            </button>
                        )}
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

            {/* MODAL */}
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

/* ---------------- MODAL COM ZOOM + OVERLAY ---------------- */

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
    return (
        <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <img
                src={foto.url}
                alt="Foto ampliada"
                className="max-w-full max-h-full"
            />

            {/* OVERLAY */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs p-3 rounded backdrop-blur max-w-[90%]">
                <p className="font-bold text-sm">{sigla}</p>
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
    );
}
