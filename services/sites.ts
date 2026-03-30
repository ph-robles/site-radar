import { createClient } from "@supabase/supabase-js";

// 🔥 Cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 🔥 Normalização (igual ao frontend)
function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// ========================================
// 🔍  AUTOCOMPLETE — ATUALIZADO
// ========================================

export async function buscarSitesAutocomplete(termo: string) {
  const termoNormalizado = normalizarTexto(termo);

  if (!termoNormalizado) return [];

  // Buscamos sigla, nome e endereço
  // OBS: Supabase NÃO faz normalização automático → por isso buscamos tudo e filtramos aqui
  const { data, error } = await supabase
    .from("sites")
    .select("sigla, nome, endereco, lat, lon, data_vencimento, capacitado");

  if (error) {
    console.error("Erro Supabase:", error);
    return [];
  }

  // 🔥 Filtro com normalização
  const filtrados = data.filter((site: any) => {
    const sigla = normalizarTexto(site.sigla);
    const nome = normalizarTexto(site.nome);
    const end = normalizarTexto(site.endereco);

    return (
      sigla.includes(termoNormalizado) ||
      nome.includes(termoNormalizado) ||
      end.includes(termoNormalizado)
    );
  });

  // Voltamos no máximo 10 sugestões
  return filtrados.slice(0, 10);
}

// ========================================
// 🔍  BUSCAR SITE POR SIGLA
// ========================================

export async function buscarPorSigla(sigla: string) {
  const termoNormalizado = normalizarTexto(sigla);

  const { data, error } = await supabase
    .from("sites")
    .select("*");

  if (error) {
    console.error("Erro Supabase:", error);
    return null;
  }

  return data.find((s: any) => normalizarTexto(s.sigla) === termoNormalizado) || null;
}

// ========================================
// 📡  BUSCAR TODOS PARA MAPA
// ========================================

export async function buscarTodosSites() {
  const { data, error } = await supabase.from("sites").select("*");

  if (error) {
    console.error("Erro Supabase:", error);
    return [];
  }

  return data;
}