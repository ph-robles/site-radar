import { NextResponse } from 'next/server';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { origin, dests } = body as {
      origin: { lat: number, lon: number },
      dests: { lat: number, lon: number }[]
    };

    if (!origin || !Array.isArray(dests) || dests.length === 0) {
      return NextResponse.json({ error: 'missing origin/dests' }, { status: 400 });
    }

    // OSRM usa LON,LAT
    const coords = [
      `${origin.lon},${origin.lat}`,
      ...dests.map(d => `${d.lon},${d.lat}`)
    ].join(';');

    const url = `https://router.project-osrm.org/table/v1/driving/${coords}?sources=0&annotations=distance,duration`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ error: 'osrm failed' }, { status: 500 });

    const data = await res.json();
    const distances = data.distances?.[0] as number[] | undefined; // metros
    const durations = data.durations?.[0] as number[] | undefined; // segundos

    if (!distances || !durations) return NextResponse.json({ rows: [] });

    const rows = dests.map((_, i) => ({
      distance_km: distances[i] != null ? Number(distances[i]) / 1000 : null,
      duration_min: durations[i] != null ? Number(durations[i]) / 60 : null
    }));

    return NextResponse.json({ rows });
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
}