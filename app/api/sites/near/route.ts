// app/api/sites/near/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const radius = parseInt(searchParams.get("radius") || "5000", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "Parâmetros lat/lng inválidos." }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("sites_nearby", {
      p_lat: lat,
      p_lon: lng,
      p_radius_m: radius,
      p_limit: limit,
    });

    if (error) throw error;

    return NextResponse.json({ sites: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erro ao buscar ERBs próximas." }, { status: 500 });
  }
}