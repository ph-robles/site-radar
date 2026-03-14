import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
 
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
 
function normalize(text: string) {
  return text
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/^RJ/, "");
}
 
export async function GET(req: Request) {
 
  const { searchParams } = new URL(req.url);
 
  const siglaRaw = searchParams.get("sigla");
 
  if (!siglaRaw) {
    return NextResponse.json({ sites: [] });
  }
 
  const sigla = normalize(siglaRaw);
 
  const { data, error } = await supabase
    .from("sites")
    .select("id, sigla, nome, detentora, endereco, capacitado")
    .or(`sigla.ilike.%${sigla}%,nome.ilike.%${sigla}%`)
    .limit(20);
 
  if (error) {
 
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
 
  }
 
  return NextResponse.json({
    sites: data ?? []
  });
 
}