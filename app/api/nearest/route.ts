// app/api/nearest/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// helper agora é async e usa get/set/remove (sem getAll)
async function getSupabaseServer() {
  const cookieStore = await cookies(); // Next 16: cookies() é Promise<ReadonlyRequestCookies>

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Use a chave que você configurou na Vercel (mantenha o MESMO nome)
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name);
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Chamado de Server Component: ignorar, middleware/SSR cuidam do refresh
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // Remoção = set com expiração no passado
            cookieStore.set(name, '', { ...options, expires: new Date(0) });
          } catch {
            // idem acima
          }
        },
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const { lat, lon } = await req.json();

    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    const supabase = await getSupabaseServer();

    // chama a RPC criada no banco
    const { data, error } = await supabase.rpc('nearest_sites', { p_lon: lon, p_lat: lat });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Erro inesperado' }, { status: 500 });
  }
}

