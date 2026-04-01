"use client"

import { useEffect, useRef, useState } from "react"
import {
    buscarFotosPorSigla,
    deletarFoto,
    uploadFoto,
    MAX_FOTOS,
} from "@/services/fotos"

interface Foto {
    id: string
    url: string
    path: string
    descricao: string | null
    criado_em: string
}

interface Props {
    sigla: string
}

export default function FotoGaleria({ sigla }: Props) {
    const [fotos, setFotos] = useState<Foto[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [erro, setErro] = useState("")
    const [fotoAmpliada, setFotoAmpliada] = useState<Foto | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Carrega fotos ao montar
    useEffect(() => {
        carregarFotos()
    }, [sigla])

    async function carregarFotos() {
        try {
            setLoading(true)
            setErro("")
            const data = await buscarFotosPorSigla(sigla)
            setFotos(data)
        } catch {
            setErro("Erro ao carregar fotos.")
        } finally {
            setLoading(false)
        }
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (fotos.length >= MAX_FOTOS) {
            setErro(`Limite de ${MAX_FOTOS} fotos atingido. Remova uma para adicionar.`)
            return
        }

        try {
            setUploading(true)
            setErro("")
            await uploadFoto(sigla, file)
            await carregarFotos()
        } catch (err: any) {
            setErro(err.message ?? "Erro ao enviar foto.")
        } finally {
            setUploading(false)
            // Limpa input para permitir re-upload do mesmo arquivo
            if (inputRef.current) inputRef.current.value = ""
        }
    }

    async function handleDeletar(foto: Foto) {
        const confirmar = window.confirm("Remover esta foto?")
        if (!confirmar) return

        try {
            setErro("")
            await deletarFoto(foto.id, foto.path)
            setFotos((prev) => prev.filter((f) => f.id !== foto.id))
            if (fotoAmpliada?.id === foto.id) setFotoAmpliada(null)
        } catch {
            setErro("Erro ao remover foto.")
        }
    }

    const podeAdicionar = fotos.length < MAX_FOTOS

    return (
        <div className="mt-4 space-y-3">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">
                    📸 Fotos ({fotos.length}/{MAX_FOTOS})
                </h3>

                {podeAdicionar && (
                    <button
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg disabled:opacity-50 transition"
                    >
                        {uploading ? "Enviando..." : "+ Adicionar foto"}
                    </button>
                )}
            </div>

            {/* Input oculto — aceita câmera e galeria */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"   // abre câmera traseira por padrão no celular
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Mensagem de erro */}
            {erro && (
                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                    {erro}
                </p>
            )}

            {/* Loading inicial */}
            {loading && (
                <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-24 h-24 rounded-xl bg-gray-200 animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Nenhuma foto */}
            {!loading && fotos.length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-400 text-sm">Nenhuma foto cadastrada</p>
                    <p className="text-gray-400 text-xs mt-1">
                        Adicione fotos da fachada ou acesso da ERB
                    </p>
                </div>
            )}

            {/* Grid de fotos */}
            {!loading && fotos.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {fotos.map((foto) => (
                        <div key={foto.id} className="relative group">
                            <img
                                src={foto.url}
                                alt={foto.descricao ?? `Foto de ${sigla}`}
                                onClick={() => setFotoAmpliada(foto)}
                                className="w-24 h-24 object-cover rounded-xl cursor-pointer border border-gray-200 hover:opacity-90 transition"
                            />
                            {/* Botão de remover */}
                            <button
                                onClick={() => handleDeletar(foto)}
                                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                                title="Remover foto"
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    {/* Slot vazio para adicionar */}
                    {podeAdicionar && (
                        <button
                            onClick={() => inputRef.current?.click()}
                            disabled={uploading}
                            className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 flex flex-col items-center justify-center text-gray-400 hover:text-blue-400 transition disabled:opacity-50"
                        >
                            <span className="text-2xl">+</span>
                            <span className="text-xs mt-0.5">Foto</span>
                        </button>
                    )}
                </div>
            )}

            {/* Modal de foto ampliada */}
            {fotoAmpliada && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setFotoAmpliada(null)}
                >
                    <div
                        className="relative max-w-lg w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={fotoAmpliada.url}
                            alt={fotoAmpliada.descricao ?? sigla}
                            className="w-full rounded-2xl shadow-2xl"
                        />
                        {fotoAmpliada.descricao && (
                            <p className="text-white text-center mt-2 text-sm">
                                {fotoAmpliada.descricao}
                            </p>
                        )}
                        <p className="text-gray-400 text-center text-xs mt-1">
                            {new Date(fotoAmpliada.criado_em).toLocaleDateString("pt-BR")}
                        </p>
                        <div className="flex gap-2 mt-3 justify-center">
                            <button
                                onClick={() => setFotoAmpliada(null)}
                                className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition"
                            >
                                Fechar
                            </button>
                            <button
                                onClick={() => handleDeletar(fotoAmpliada)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                            >
                                🗑 Remover
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}