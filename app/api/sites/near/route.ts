import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
 
type SiteNear = {
  id: number;
  sigla: string;
  nome: string | null;
  endereco: string | null;
  lat: number | null;
  lon: number | null;
  distancia_m: number;
  capacitado: string | null;
};
 
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
 
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const radius = Number(searchParams.get("radius") ?? 5000);
 
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json(
        { sites: [], error: "lat/lng inválidos" },
        { status: 400 }
      );
    }
 
    // chama a função do banco
    const { data, error } = await supabase.rpc("nearby_sites", {
      user_lat: lat,
      user_lng: lng,
      radius_m: radius,
    });
 
    if (error) {
      return NextResponse.json(
        { sites: [], error: error.message },
        { status: 500 }
      );
    }
 
    return NextResponse.json(
      { sites: data ?? [] },
      { status: 200 }
    );
 
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro interno";
    return NextResponse.json(
      { sites: [], error: msg },
      { status: 500 }
    );
  }
}