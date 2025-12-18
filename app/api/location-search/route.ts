import { NextRequest, NextResponse } from 'next/server';
import { searchLocations } from '@/lib/mapbox';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body?.query;

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results = await searchLocations(query);
    return NextResponse.json({ results });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Location search API error:', errorMessage);
    return NextResponse.json(
      { error: 'Location search failed', details: errorMessage, results: [] },
      { status: 500 }
    );
  }
}
