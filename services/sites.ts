import { supabase } from "@/lib/supabase";

// ── Limpa o input do usuário gerando variações para busca ─────────────────────
// Exemplos que funcionam:
//   "RJDJU"   → tenta "RJDJU", depois "DJU"
//   "RJ DJU"  → tenta "RJ DJU", depois "DJU"
//   "rj dju"  → normaliza para "DJU"
//   "RJarc"   → tenta "RJARC", depois "ARC"
//   "DJU"     → tenta direto "DJU"

const PREFIXOS_ESTADO = [
  "RJ", "SP", "MG", "ES", "BA", "PR", "SC", "RS",
  "GO", "MT", "MS", "PA", "AM", "CE", "PE", "MA",
  "PI", "RN", "PB", "AL", "SE", "TO", "AC", "RO",
  "RR", "AP", "DF",
];

function gerarVariacoes(input: string): string[] {
  const limpo = input.trim().toUpperCase().replace(/\s+/g, "");
  const variacoes: string[] = [];

  // 1. Termo exato normalizado
  variacoes.push(limpo);

  // 2. Remove prefixo de estado se encontrado no início
  for (const prefix of PREFIXOS_ESTADO) {
    if (limpo.startsWith(prefix) && limpo.length > prefix.length) {
      const semPrefixo = limpo.slice(prefix.length);
      variacoes.push(semPrefixo);
      break;
    }
  }

  // 3. Versão com espaço original (ex: "RJ DJU" → "DJU")
  const comEspaco = input.trim().toUpperCase();
  if (comEspaco !== limpo) {
    variacoes.push(comEspaco);
    const partes = comEspaco.split(/\s+/);
    if (partes.length >= 2) {
      // última palavra (provavelmente a sigla real)
      variacoes.push(partes[partes.length - 1]);
      // segunda parte em diante
      variacoes.push(partes.slice(1).join(""));
    }
  }

  // Remove duplicatas mantendo ordem
  return [...new Set(variacoes)];
}

// Buscar ERB pela sigla (para /buscar) — tenta múltiplas variações
export async function buscarSitePorSigla(sigla: string) {
  const variacoes = gerarVariacoes(sigla);

  for (const termo of variacoes) {
    const { data, error } = await supabase
      .from("sites")
      .select("*")
      .ilike("sigla", termo)
      .order("id", { ascending: false })
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      return data[0];
    }
  }

  throw new Error("ERB não encontrada");
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
  const variacoes = gerarVariacoes(parcial);
  const termoBusca = variacoes[variacoes.length - 1]; // usa a variação mais limpa

  const { data, error } = await supabase
    .from("sites")
    .select("id, sigla, nome")
    .ilike("sigla", `${termoBusca}%`)
    .limit(5);

  if (error) throw error;
  return data;
}

// Buscar apenas sites CAPACITADOS com coordenadas (para o mapa)
export async function buscarTodosSitesParaMapa() {
  const { data, error } = await supabase
    .from("sites")
    .select("id, sigla, endereco, lat, lon, capacitado")
    .not("lat", "is", null)
    .not("lon", "is", null)
    .eq("capacitado", "SIM");

  if (error) throw error;
  return data ?? [];
}
