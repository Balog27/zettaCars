import { NextResponse } from 'next/server';

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { geocodeAddress, getDistance } from '@/lib/mapbox';

type Loc = {
  address?: string;
  lat?: number;
  lng?: number;
};

const CLUJ_KEYWORDS = ["cluj", "cluj-napoca", "napoca"];

// Cluj-Napoca city center coordinates
const CLUJ_CENTER_LAT = 46.7712;
const CLUJ_CENTER_LON = 23.6236;
// Distance in km - transfers within this radius are considered in-city
const CITY_RADIUS_KM = 7;

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isInCluj(address?: string, lat?: number, lon?: number): boolean {
  if (!address && (lat == null || lon == null)) return false;

  // If we have coordinates, use them for accurate distance-based check
  if (lat != null && lon != null) {
    const distanceFromCenter = calculateDistance(CLUJ_CENTER_LAT, CLUJ_CENTER_LON, lat, lon);
    return distanceFromCenter <= CITY_RADIUS_KM;
  }

  // Fallback: if only address is available, check keywords
  const a = address?.toLowerCase() ?? '';
  return CLUJ_KEYWORDS.some(k => a.includes(k));
}

async function fetchPricingFromConvex() {
  const deploymentUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!deploymentUrl) return null;
  try {
    const client = new ConvexHttpClient(deploymentUrl);
    // Use the generated API to query pricing
    const pricing = await client.query((api as any).transfers.getTransferPricing);
    return pricing || null;
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Debug log incoming body (dev only)
    // eslint-disable-next-line no-console
    console.log('[/api/transfer-price] request body:', JSON.stringify(body));

    // Validate required fields
    const { pickup, dropoff, category } = body as { pickup: Loc; dropoff: Loc; category: 'standard'|'premium'|'van'; pricing?: any };
    if (!pickup || typeof pickup !== 'object' || (!pickup.address && (pickup.lat == null || pickup.lng == null))) {
      return NextResponse.json({ error: 'Missing or invalid pickup location', received: pickup }, { status: 400 });
    }
    if (!dropoff || typeof dropoff !== 'object' || (!dropoff.address && (dropoff.lat == null || dropoff.lng == null))) {
      return NextResponse.json({ error: 'Missing or invalid dropoff location', received: dropoff }, { status: 400 });
    }
    if (!category || !['standard','premium','van'].includes(category)) {
      return NextResponse.json({ error: 'Missing or invalid category', received: category }, { status: 400 });
    }

    // Try to use pricing from the request, otherwise attempt to fetch it from Convex
    let pricing = (body as any).pricing;
    // eslint-disable-next-line no-console
    console.log('[/api/transfer-price] pricing in body present:', !!pricing);
    if (!pricing) {
      pricing = await fetchPricingFromConvex();
      // eslint-disable-next-line no-console
      console.log('[/api/transfer-price] pricing fetched from Convex:', JSON.stringify(pricing));
    }

    // Validate pricing exists; if not, return error
    if (!pricing) {
      // eslint-disable-next-line no-console
      console.warn('[/api/transfer-price] pricing missing in body and not found in Convex');
      return NextResponse.json({ error: 'Pricing required', note: 'no pricing in request and no pricing found in Convex' }, { status: 400 });
    }

    let distanceKm: number | null = null;
    let durationText: string | null = null;
    let totalPrice: number | null = null;
    let priceMin: number | null = null;
    let priceMax: number | null = null;
    let pricingSource = 'fixed';

    // Get coordinates for both locations (geocode if needed)
    let fromLat = pickup.lat;
    let fromLon = pickup.lng;
    let toLat = dropoff.lat;
    let toLon = dropoff.lng;

    // Geocode pickup if we only have address
    if ((fromLat == null || fromLon == null) && pickup.address) {
      const pickupGeo = await geocodeAddress(pickup.address);
      if (pickupGeo) {
        fromLat = pickupGeo.coordinates.lat;
        fromLon = pickupGeo.coordinates.lon;
      } else {
        return NextResponse.json({ error: 'Could not geocode pickup location', address: pickup.address }, { status: 400 });
      }
    }

    // Geocode dropoff if we only have address
    if ((toLat == null || toLon == null) && dropoff.address) {
      const dropoffGeo = await geocodeAddress(dropoff.address);
      if (dropoffGeo) {
        toLat = dropoffGeo.coordinates.lat;
        toLon = dropoffGeo.coordinates.lon;
      } else {
        return NextResponse.json({ error: 'Could not geocode dropoff location', address: dropoff.address }, { status: 400 });
      }
    }

    if (fromLat == null || fromLon == null || toLat == null || toLon == null) {
      return NextResponse.json({ error: 'Could not determine coordinates for locations' }, { status: 400 });
    }

    // Now check if both locations are within the city radius
    const bothInCluj = isInCluj(pickup?.address, fromLat, fromLon) && isInCluj(dropoff?.address, toLat, toLon);

    if (bothInCluj) {
      // Fixed pricing for in-city transfers - single price
      totalPrice = pricing.fixedPrices?.[category] ?? 0;
      pricingSource = 'fixed';
    } else {
      // Use Mapbox API for distance calculation
      try {
        const distance = await getDistance(fromLat, fromLon, toLat, toLon);
        distanceKm = distance.distanceKm;
        durationText = distance.durationText;
        pricingSource = 'distance';

        // Distance-based pricing - use min-max interval
        const perKmPrice = pricing.pricePerKm?.[category];
        const minPerKm = perKmPrice?.min ?? 0;
        const maxPerKm = perKmPrice?.max ?? 0;
        priceMin = Math.round(distanceKm * minPerKm * 100) / 100;
        priceMax = Math.round(distanceKm * maxPerKm * 100) / 100;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[/api/transfer-price] Mapbox error:', error);
        return NextResponse.json({ error: 'Distance calculation error', details: String(error) }, { status: 502 });
      }
    }

    // For debugging, include pricingSource and pricing snapshot (dev only)
    return NextResponse.json({ 
      calculated: {
        totalPrice, 
        priceMin, 
        priceMax, 
        distanceKm, 
        durationText,
        pricingSource, 
        pricingUsed: pricing
      }
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[/api/transfer-price] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
