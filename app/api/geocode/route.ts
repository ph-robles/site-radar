import { NextRequest, NextResponse } from "next/server";

type GeocodeResult = {
  lat: number;
  lon: number;
  endereco?: string | null;
};

type GeocodeResponse = { result: GeocodeResult | null; error?: string };

export async function GET(req: NextRequest): Promise<NextResponse<GeocodeResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    if (!q) {
      return NextResponse.json({ result: null, error: "Parâmetro 'q' é obrigatório." }, { status: 400 });
    }

    // TODO: Chamar seu serviço de geocoding real
    const result: GeocodeResult = {
      lat: -22.9068,
      lon: -43.1729,
      endereco: q,
    };

    return NextResponse.json({ result }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro interno";
    return NextResponse.json({ result: null, error: msg }, { status: 500 });
  }
}