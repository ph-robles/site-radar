import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") || "").trim();

    if (!query) return NextResponse.json({ sites: [] });

    // Chama a função SQL que prioriza prefixo
    const { data, error } = await supabase.rpc("sites_search_sigla", {
      p_query: query,
      p_limit: 50,
    });

    if (error) throw error;
    return NextResponse.json({ sites: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}