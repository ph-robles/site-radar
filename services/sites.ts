import { supabase } from "@/lib/supabase";

// Buscar ERB pela sigla (para /buscar)
export async function buscarSitePorSigla(sigla: string) {
  const termo = sigla.trim().toUpperCase();

  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .ilike("sigla", termo)
    .order("id", { ascending: false })
    .limit(1);

  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error("ERB não encontrada");
  }

  return data[0];
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

// Buscar todos os sites com coordenadas (para o mapa)
export async function buscarTodosSitesParaMapa() {
  const { data, error } = await supabase
    .from("sites")
    .select("id, sigla, endereco, lat, lon, capacitado")
    .not("lat", "is", null)
    .not("lon", "is", null);

  if (error) throw error;
  return data ?? [];
}