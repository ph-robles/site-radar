import { supabase } from "@/lib/supabase";
 
export async function getSites() {
  const { data, error } = await supabase
    .from("sites")
    .select("id, sigla, nome, detentora, lat, lon");
 
  if (error) {
    console.error("Erro ao buscar sites:", error);
    return [];
  }
 
  return data ?? [];
}
 
export async function searchSiteBySigla(sigla: string) {
 
  const { data, error } = await supabase
    .from("sites")
    .select("id, sigla, nome, detentora, lat, lon")
    .ilike("sigla", sigla);
 
  if (error) {
    console.error("Erro ao buscar site:", error);
    return null;
  }
 
  return data?.[0] ?? null;
}
 