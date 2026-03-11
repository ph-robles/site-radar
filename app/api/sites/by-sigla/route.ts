import { NextRequest, NextResponse } from "next/server";

type Site = {
  id: number;
  sigla: string;
  nome: string | null;
  endereco: string | null;
  lat: number | null;
  lon: number | null;
};

type BySiglaResponse = { site: Site | null; error?: string };

export async function GET(req: NextRequest): Promise<NextResponse<BySiglaResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const sigla = (searchParams.get("sigla") ?? "").trim().toUpperCase();

    if (!sigla) return NextResponse.json({ site: null, error: "sigla obrigatória" }, { status: 400 });

    // TODO: Query real
    const site: Site | null = sigla === "ERB001"
      ? { id: 1, sigla: "ERB001", nome: "Torre Centro", endereco: "Rua X, 123", lat: -22.9, lon: -43.17 }
      : null;

    return NextResponse.json({ site }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro interno";
    return NextResponse.json({ site: null, error: msg }, { status: 500 });
  }
}