import { NextRequest, NextResponse } from "next/server";

type Site = {
  id: number;
  sigla: string;
  lat: number;
  lon: number;
  distancia_m: number;
};

type NearestResponse = { sites: Site[]; error?: string };

export async function GET(req: NextRequest): Promise<NextResponse<NearestResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const radius = Number(searchParams.get("radius") ?? 5000);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ sites: [], error: "lat/lng inválidos" }, { status: 400 });
    }

    // TODO: Consultar base de dados real
    const sites: Site[] = [
      { id: 1, sigla: "ERB001", lat, lon: lng, distancia_m: 123 },
    ];

    return NextResponse.json({ sites }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro interno";
    return NextResponse.json({ sites: [], error: msg }, { status: 500 });
  }
}