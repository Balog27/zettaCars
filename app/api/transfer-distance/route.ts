import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const origin = body?.origin;
    const destination = body?.destination;

    if (!origin || !destination) {
      return new Response(JSON.stringify({ error: 'Missing origin or destination' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) {
      return new Response(JSON.stringify({ error: 'Server missing GOOGLE_MAPS_API_KEY' }), { status: 500, headers: { 'content-type': 'application/json' } });
    }

    const params = new URLSearchParams({
      origins: origin,
      destinations: destination,
      units: 'metric',
      key,
    });

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`;
    const res = await fetch(url, { method: 'GET' });
    const data = await res.json();

    // Basic validation
    if (data.status !== 'OK' || !data.rows || !data.rows[0] || !data.rows[0].elements) {
      return new Response(JSON.stringify({ error: 'Distance Matrix API error', details: data }), { status: 502, headers: { 'content-type': 'application/json' } });
    }

    const element = data.rows[0].elements[0];
    if (!element || element.status !== 'OK') {
      return new Response(JSON.stringify({ error: 'No route found', details: element }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    const distanceMeters = element.distance?.value ?? null;
    const durationSeconds = element.duration?.value ?? null;

    return new Response(
      JSON.stringify({
        distanceMeters,
        distanceText: element.distance?.text ?? null,
        distanceKm: distanceMeters != null ? Math.round((distanceMeters / 1000) * 100) / 100 : null,
        durationSeconds,
        durationText: element.duration?.text ?? null,
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Server error', details: String(err) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
