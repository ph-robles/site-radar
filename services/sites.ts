import { supabase } from "@/lib/supabase"
 
export async function buscarSitePorSigla(sigla: string) {
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .ilike("sigla", sigla)
    .single()
 
  if (error) throw error
 
  return data
}