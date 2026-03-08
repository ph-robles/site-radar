// app/api/nearest/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// helper agora é async
async function getSupabaseServer() {
  const cookieStore = await cookies(); // <<-- AQUI é o conserto: aguarda o Promise<ReadonlyRequestCookies>

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // use a sua publishable/anon key; mantenha o MESMO nome de env que você configurou na Vercel
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // chamada feita a partir de Server Component — sem problema; middleware/SSR cuidam do refresh
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

    const supabase = await getSupabaseServer(); // <<-- também precisa de await aqui

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
