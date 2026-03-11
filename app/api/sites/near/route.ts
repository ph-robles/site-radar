import { NextRequest, NextResponse } from "next/server";

type SiteNear = {
  id: number;
  sigla: string;
  nome: string | null;
  endereco: string | null;
  lat: number | null;
  lon: number | null;
  distancia_m: number;
};

type SitesNearResponse = { sites: SiteNear[]; error?: string };

export async function GET(req: NextRequest): Promise<NextResponse<SitesNearResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const radius = Number(searchParams.get("radius") ?? 5000);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ sites: [], error: "lat/lng inválidos" }, { status: 400 });
    }

    // TODO: Query real (ordenado por distância)
    const sites: SiteNear[] = [
      { id: 1, sigla: "ERB001", nome: "Torre Centro", endereco: "Rua X, 123", lat, lon: lng, distancia_m: 123 },
    ];

    return NextResponse.json({ sites }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro interno";
    return NextResponse.json({ sites: [], error: msg }, { status: 500 });
  }
}