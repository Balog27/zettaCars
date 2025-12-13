import type { NextRequest } from 'next/server';
import { geocodeAddress, getDistance } from '@/lib/mapbox';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const origin = body?.origin;
    const destination = body?.destination;

    if (!origin || !destination) {
      return new Response(JSON.stringify({ error: 'Missing origin or destination' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    try {
      // Geocode the addresses to get coordinates
      const originGeo = await geocodeAddress(origin);
      const destinationGeo = await geocodeAddress(destination);

      if (!originGeo || !destinationGeo) {
        return new Response(
          JSON.stringify({ error: 'Could not geocode one or both locations' }),
          { status: 400, headers: { 'content-type': 'application/json' } }
        );
      }

      // Get distance using Mapbox
      const distance = await getDistance(
        originGeo.coordinates.lat,
        originGeo.coordinates.lon,
        destinationGeo.coordinates.lat,
        destinationGeo.coordinates.lon
      );

      return new Response(
        JSON.stringify({
          distanceMeters: distance.distanceKm * 1000,
          distanceText: `${distance.distanceKm} km`,
          distanceKm: distance.distanceKm,
          durationSeconds: distance.durationSeconds,
          durationText: distance.durationText,
        }),
        { status: 200, headers: { 'content-type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Distance calculation error', details: String(error) }),
        { status: 502, headers: { 'content-type': 'application/json' } }
      );
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Server error', details: String(err) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
