// app/api/nearest/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // Use a PUBLISHABLE ou ANON_KEY que você configurou na Vercel
  (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
);

export async function POST(req: Request) {
  try {
    const { lat, lon } = await req.json();

    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('nearest_sites', { p_lon: lon, p_lat: lat });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Erro inesperado' }, { status: 500 });
  }
}

