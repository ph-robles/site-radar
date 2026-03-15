import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
 
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
 
export async function POST(req: Request) {
 
  const body = await req.json();
 
  const {
    site_id,
    portas_disponiveis,
    observacao,
    foto_local,
    foto_cadeado,
    foto_portas
  } = body;
 
  const { error } = await supabase
    .from("site_updates")
    .insert({
      site_id,
      portas_disponiveis,
      observacao,
      foto_local,
      foto_cadeado,
      foto_portas
    });
 
  if (error) {
 
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
 
  }
 
  return NextResponse.json({ success: true });
 
}
 