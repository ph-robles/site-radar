import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    // Apenas leitura com anon; RLS controla o acesso
    auth: { persistSession: false, autoRefreshToken: false },
  }
);