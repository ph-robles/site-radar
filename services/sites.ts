import { supabase } from "@/lib/supabaseClient";
 
export async function getSites() {
 
  const { data, error } = await supabase
    .from("sites")
    .select("id, sigla, nome, detentora, lat, lon")
    .not("lat", "is", null)
    .not("lon", "is", null);
 
  if (error) {
    console.error("Erro ao buscar sites:", error);
    return [];
  }
 
  return data;
}