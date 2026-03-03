// services/sites.ts
import { supabase } from '@/lib/supabaseClient';

export type Site = {
  id: string | number;
  sigla: string;
  nome: string;
  // ...adicione outras colunas que você tiver
};

export async function searchSites(q: string, limit = 20) {
  if (!q?.trim()) return { data: [] as Site[], error: null };

  // Escapar % e _ ( curingas do LIKE ) para evitar comportamentos inesperados
  const sanitized = q.replace(/[%_]/g, '\\$&');

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    // PostgREST OR: filtra por sigla OU nome com ILIKE
    .or(`sigla.ilike.%${sanitized}%,nome.ilike.%${sanitized}%`)
    .limit(limit);

  return { data: (data as Site[]) ?? [], error };
}