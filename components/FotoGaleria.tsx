"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    buscarFotosPorSigla,
    uploadFoto,
    deletarFoto,
    MAX_FOTOS,
} from "@/services/fotos";

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
    const [uploading, setUploading] = useState(false);
    const [erro, setErro] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    async function carregar() {
        const data = await buscarFotosPorSigla(sigla);
        setFotos(data);
    }

    useEffect(() => {
        carregar();
    }, [sigla]);

    async function handleDelete(id: string, path: string) {
        if (!confirm("Remover esta foto?")) return;
        await deletarFoto(id, path);
        await carregar();
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (fotos.length >= MAX_FOTOS) {
            setErro(`Limite de ${MAX_FOTOS} fotos atingido. Remova uma para adicionar.`);
            return;
        }

        try {
            setUploading(true);
            setErro("");
            await uploadFoto(sigla, file);
            await carregar();
        } catch (err: any) {
            setErro(err.message ?? "Erro ao enviar foto.");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    const podeAdicionar = fotos.length < MAX_FOTOS;

    return (
        <div className="mt-4">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm">
                    📸 Fotos ({fotos.length}/{MAX_FOTOS})
                </p>
                {podeAdicionar && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="bg-[#7300E6] hover:bg-[#4B0099] text-white text-xs font-semibold
                            px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                    >
                        {uploading ? "Enviando..." : "📷 Adicionar foto"}
                    </button>
                )}
            </div>

            {/* Input oculto — abre câmera ou galeria no celular */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Erro */}
            {erro && (
                <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg mb-2">
                    {erro}
                </p>
            )}

            {/* Estado vazio — área clicável */}
            {fotos.length === 0 && !uploading && (
                <div
                    onClick={() => podeAdicionar && inputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl py-6 text-center
                        text-gray-400 text-sm cursor-pointer hover:border-[#7300E6]
                        hover:text-[#7300E6] transition"
                >
                    <p className="text-2xl mb-1">📷</p>
                    <p>Toque para adicionar a primeira foto</p>
                </div>
            )}

            {/* Grid de fotos */}
            {fotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {fotos.map((f) => (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => setFotoAberta(f)}
                            className="relative rounded-xl overflow-hidden focus:outline-none"
                        >
                            <img
                                src={f.url}
                                alt="Foto da ERB"
                                className="w-full h-24 object-cover"
                                loading="lazy"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-black/60
                                text-white text-[10px] p-1">
                                <p className="font-bold">{sigla}</p>
                                <p>📅 {new Date(f.criado_em).toLocaleString("pt-BR")}</p>
                            </div>
                            <span
                                onClick={(e) => { e.stopPropagation(); handleDelete(f.id, f.path); }}
                                className="absolute top-1 right-1 bg-red-600 text-white text-xs
                                    w-5 h-5 flex items-center justify-center rounded-full
                                    cursor-pointer hover:bg-red-700 transition shadow"
                            >
                                ✕
                            </span>
                        </button>
                    ))}

                    {/* Slot + para adicionar mais */}
                    {podeAdicionar && (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={uploading}
                            className="h-24 rounded-xl border-2 border-dashed border-gray-300
                                flex flex-col items-center justify-center text-gray-400
                                hover:border-[#7300E6] hover:text-[#7300E6] transition
                                disabled:opacity-50"
                        >
                            <span className="text-2xl">+</span>
                            <span className="text-xs">Foto</span>
                        </button>
                    )}
                </div>
            )}

            {/* Modal ampliado */}
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

/* ── Modal com zoom ─────────────────────────────────────────────── */
function ZoomModal({ foto, sigla, endereco, onClose }: {
    foto: any; sigla: string; endereco: string; onClose: () => void;
}) {
    const [loaded, setLoaded] = useState(false);
    const [scale, setScale] = useState(1);

    useEffect(() => { setScale(1); setLoaded(false); }, [foto]);

    return (
        <div
            className="fixed inset-0 bg-black/95 flex items-center justify-center"
            style={{ zIndex: 3000 }}
            onClick={onClose}
        >
            <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
                {!loaded && (
                    <div className="text-white text-sm absolute inset-0 flex items-center justify-center">
                        Carregando…
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
                        setScale((s) => Math.min(Math.max(s * (e.deltaY < 0 ? 1.15 : 0.9), 1), 4));
                    }}
                />
                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs p-3 rounded">
                    <p className="font-bold">{sigla}</p>
                    <p>{endereco}</p>
                    <p>📅 {new Date(foto.criado_em).toLocaleString("pt-BR")}</p>
                </div>
                <button className="absolute top-4 right-4 text-white text-2xl" onClick={onClose}>✕</button>
            </div>
        </div>
    );
}
