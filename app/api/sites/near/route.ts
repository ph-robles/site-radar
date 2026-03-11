import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
 
type SiteNear = {
  id: number;
  sigla: string;
  nome: string | null;
  endereco: string | null;
  lat: number;
  lon: number;
  distancia_m: number;
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
 
    // Busca dados no Supabase
    const { data, error } = await supabase
      .from("sites")
      .select("id,sigla,nome,endereco,lat,lon");
 
    if (error) {
      return NextResponse.json({ sites: [], error: error.message }, { status: 500 });
    }
 
    // calcular distância
    const sites = (data || [])
      .map((s) => {
        const dist = getDistance(lat, lng, s.lat, s.lon);
 
        return {
          ...s,
          distancia_m: dist,
        };
      })
      .filter((s) => s.distancia_m <= radius)
      .sort((a, b) => a.distancia_m - b.distancia_m);
 
    return NextResponse.json({ sites });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro interno";
    return NextResponse.json({ sites: [], error: msg }, { status: 500 });
  }
}
 
/* calcular distância entre coordenadas */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
 
  const toRad = (x: number) => (x * Math.PI) / 180;
 
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
 
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
 
  return R * c;
}