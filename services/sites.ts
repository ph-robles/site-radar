import { supabase } from "@/lib/supabase";
 
export type Site = {
  id: number;
  sigla: string;
  nome: string;
  detentora: string;
  lat: number;
  lon: number;
};
 
export async function getSites(): Promise<Site[]> {
 
  const { data, error } = await supabase
    .from("sites")
    .select("id, sigla, nome, detentora, lat, lon");
 
  if (error) {
    console.error("Erro ao buscar sites:", error);
    return [];
  }
 
  return data ?? [];
}
 
export async function searchSites(sigla: string): Promise<Site[]> {
 
  const cleaned = sigla
    .toUpperCase()
    .replace("RJ", "")
    .replace(/\s/g, "");
 
  const { data, error } = await supabase
    .from("sites")
    .select("id, sigla, nome, detentora, lat, lon")
    .ilike("sigla", `%${cleaned}%`)
    .limit(5);
 
  if (error) {
    console.error("Erro ao buscar sites:", error);
    return [];
  }
 
  return data ?? [];
}
 