// app/api/sites/by-sigla/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic"; // sem cache em build
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") || "").trim();

    if (!query) {
      return NextResponse.json({ sites: [] }, { headers: { "Cache-Control": "no-store" } });
    }

    // Função SQL que prioriza quem começa com a sigla e depois quem contém
    const { data, error } = await supabase.rpc("sites_search_sigla", {
      p_query: query,
      p_limit: 50,
    });

    if (error) throw error;

    return NextResponse.json({ sites: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erro ao buscar por sigla." }, { status: 500 });
  }
}