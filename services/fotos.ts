import { supabase } from "@/lib/supabase"

const BUCKET = "site-fotos"
const MAX_FOTOS = 3

// Busca todas as fotos de uma ERB por sigla
export async function buscarFotosPorSigla(sigla: string) {
    const { data, error } = await supabase
        .from("site_fotos")
        .select("*")
        .eq("site_sigla", sigla.toUpperCase())
        .order("criado_em", { ascending: true })

    if (error) throw error
    return data ?? []
}

// Faz upload de uma foto e salva o registro na tabela
export async function uploadFoto(
    sigla: string,
    file: File,
    descricao?: string
): Promise<{ url: string; path: string }> {
    // Valida tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
        throw new Error("Foto muito grande. Máximo 5MB.")
    }

    // Gera nome único para evitar conflito
    const ext = file.name.split(".").pop() ?? "jpg"
    const path = `${sigla.toUpperCase()}/${Date.now()}.${ext}`

    // Comprime a imagem antes do upload
    const fileComprimido = await comprimirImagem(file)

    // Upload no Storage
    const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, fileComprimido, { upsert: false })

    if (uploadError) throw uploadError

    // Pega URL pública
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
    const url = urlData.publicUrl

    // Salva metadados na tabela
    const { error: dbError } = await supabase.from("site_fotos").insert({
        site_sigla: sigla.toUpperCase(),
        url,
        path,
        descricao: descricao ?? null,
    })

    if (dbError) throw dbError

    return { url, path }
}

// Remove foto do storage e da tabela
export async function deletarFoto(id: string, path: string) {
    // Remove do Storage
    const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove([path])

    if (storageError) throw storageError

    // Remove da tabela
    const { error: dbError } = await supabase
        .from("site_fotos")
        .delete()
        .eq("id", id)

    if (dbError) throw dbError
}

// Verifica se a ERB já atingiu o limite de fotos
export async function contarFotos(sigla: string): Promise<number> {
    const { count, error } = await supabase
        .from("site_fotos")
        .select("id", { count: "exact", head: true })
        .eq("site_sigla", sigla.toUpperCase())

    if (error) throw error
    return count ?? 0
}

export { MAX_FOTOS }

// ─── Utilitário: comprime imagem via Canvas ───────────────────────────────────
async function comprimirImagem(file: File, qualidade = 0.75): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
            // Reduz resolução se muito grande (máx 1600px na maior dimensão)
            const MAX = 1600
            let { width, height } = img
            if (width > MAX || height > MAX) {
                if (width > height) {
                    height = Math.round((height * MAX) / width)
                    width = MAX
                } else {
                    width = Math.round((width * MAX) / height)
                    height = MAX
                }
            }

            const canvas = document.createElement("canvas")
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext("2d")!
            ctx.drawImage(img, 0, 0, width, height)

            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(url)
                    if (blob) resolve(blob)
                    else reject(new Error("Falha ao comprimir imagem"))
                },
                "image/jpeg",
                qualidade
            )
        }

        img.onerror = () => reject(new Error("Falha ao carregar imagem"))
        img.src = url
    })
}