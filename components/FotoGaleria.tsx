"use client";

import { useEffect, useState } from "react";
import {
    buscarFotosPorSigla,
    uploadFoto,
    deletarFoto,
    contarFotos,
    MAX_FOTOS,
} from "@/services/fotos";

export default function FotoGaleria({ sigla }: { sigla: string }) {
    const [fotos, setFotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

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

            <div className="grid grid-cols-3 gap-2">
                {fotos.map((f) => (
                    <div key={f.id} className="relative group">
                        <img
                            src={f.url}
                            className="w-24 h-24 object-cover rounded border"
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
        </div>
    );
}