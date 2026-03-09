import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    if (!q) return NextResponse.json({});

    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("q", q);
    url.searchParams.set("limit", "1");
    url.searchParams.set("addressdetails", "1");

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "SiteRadar/1.0 (ph.robles33@gmail.com)" },
      next: { revalidate: 0 },
    });

    if (!res.ok) throw new Error("Falha no geocoding.");
    const arr = await res.json();
    if (!Array.isArray(arr) || arr.length === 0) return NextResponse.json({});

    const item = arr[0];
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const label = item.display_name as string;

    return NextResponse.json({ lat, lng, label }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}