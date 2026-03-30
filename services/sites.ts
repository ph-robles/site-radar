import { supabase } from "@/lib/supabase";

// Buscar ERB pela sigla (para /buscar)
export async function buscarSitePorSigla(sigla: string) {
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .ilike("sigla", sigla)
    .single();

  if (error) throw error;
  return data;
}

// Buscar ERBs próximas (para /proximo e /endereco)
export async function buscarSitesProximos(lat: number, lon: number) {
  const { data, error } = await supabase.rpc("buscar_sites_proximos", {
    user_lat: lat,
    user_lon: lon,
  });

  if (error) throw error;
  return data;
}

// Sugestões de sigla (para autocomplete)
export async function buscarSugestoesSigla(parcial: string) {
  const { data, error } = await supabase
    .from("sites")
    .select("id, sigla, nome")
    .ilike("sigla", `${parcial}%`)
    .limit(5);

  if (error) throw error;
  return data;
}