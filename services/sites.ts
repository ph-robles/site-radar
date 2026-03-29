import { supabase } from "@/lib/supabase";

// Buscar site por SIGLA (usado no BuscarPage)
export async function buscarSitePorSigla(sigla: string) {
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .ilike("sigla", sigla)
    .single();

  if (error) throw error;

  return data;
}

// Buscar sites mais próximos (usado no Próximo a mim)
export async function buscarSitesProximos(lat: number, lon: number) {
  const { data, error } = await supabase.rpc("buscar_sites_proximos", {
    user_lat: lat,
    user_lon: lon,
  });

  if (error) throw error;

  return data;
}