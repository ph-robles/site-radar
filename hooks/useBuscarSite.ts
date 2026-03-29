"use client"
 
import { useState } from "react"
import { buscarSitePorSigla } from "@/services/sites"
 
export function useBuscarSite() {
  const [loading, setLoading] = useState(false)
  const [site, setSite] = useState<any>(null)
  const [erro, setErro] = useState("")
 
  async function buscar(sigla: string) {
    try {
      setLoading(true)
      setErro("")
      setSite(null)
 
      const data = await buscarSitePorSigla(sigla)
      setSite(data)
 
    } catch (err) {
      setErro("Site não encontrado")
    } finally {
      setLoading(false)
    }
  }
 
  return { buscar, loading, site, erro }
}