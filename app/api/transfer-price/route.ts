import { NextResponse } from 'next/server';

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

type Loc = {
  address?: string;
  lat?: number;
  lng?: number;
};

const CLUJ_KEYWORDS = ["cluj", "cluj-napoca", "napoca"];

function isInCluj(address?: string) {
  if (!address) return false;
  const a = address.toLowerCase();
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

    const bothInCluj = isInCluj(pickup?.address) && isInCluj(dropoff?.address);

    let distanceKm: number | null = null;
    let durationText: string | null = null;
    let totalPrice: number | null = null;
    let priceMin: number | null = null;
    let priceMax: number | null = null;
    let pricingSource = 'fixed';

    if (bothInCluj) {
      // Fixed pricing for in-city transfers - single price
      totalPrice = pricing.fixedPrices?.[category] ?? 0;
      pricingSource = 'fixed';
    } else {
      // Use Google Maps Distance Matrix API
      const key = process.env.GOOGLE_MAPS_API_KEY;
      if (!key) {
        return NextResponse.json({ error: 'Server missing GOOGLE_MAPS_API_KEY' }, { status: 500 });
      }

      // Build origins/destinations
      const origins = pickup.lat && pickup.lng ? `${pickup.lat},${pickup.lng}` : encodeURIComponent(pickup.address || '');
      const destinations = dropoff.lat && dropoff.lng ? `${dropoff.lat},${dropoff.lng}` : encodeURIComponent(dropoff.address || '');

      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origins}&destinations=${destinations}&key=${key}`;

      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        // eslint-disable-next-line no-console
        console.error('[/api/transfer-price] Google Maps API error:', text);
        return NextResponse.json({ error: 'Distance API error', details: text }, { status: 502 });
      }
      const data = await res.json();
      // Debug log full Google Maps response
      // eslint-disable-next-line no-console
      console.log('[/api/transfer-price] Google Maps API response:', JSON.stringify(data));
      // Parse distance in meters
      const elem = data?.rows?.[0]?.elements?.[0];
      if (!elem || elem.status !== 'OK') {
        // eslint-disable-next-line no-console
        console.error('[/api/transfer-price] Could not determine distance:', JSON.stringify(elem));
        return NextResponse.json({ error: 'Could not determine distance', details: elem, fullResponse: data }, { status: 400 });
      }
      const meters = elem.distance?.value ?? 0;
      distanceKm = Math.max(0, Math.round((meters / 1000) * 100) / 100); // two decimals
      
      // Extract duration text from Google Maps response
      durationText = elem.duration?.text ?? null;

      // Distance-based pricing - use min-max interval
      const perKmPrice = pricing.pricePerKm?.[category];
      const minPerKm = perKmPrice?.min ?? 0;
      const maxPerKm = perKmPrice?.max ?? 0;
      priceMin = Math.round(distanceKm * minPerKm * 100) / 100;
      priceMax = Math.round(distanceKm * maxPerKm * 100) / 100;
      pricingSource = 'distance';
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
