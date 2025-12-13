"use server";

/**
 * Mapbox API utilities for geocoding and distance calculations
 * Requires MAPBOX_ACCESS_TOKEN environment variable
 */

const MAPBOX_API_BASE = "https://api.mapbox.com";

/**
 * Forward geocoding - convert address string to coordinates
 */
export async function geocodeAddress(address: string) {
  if (!address || address.trim().length === 0) {
    throw new Error("Address is required");
  }

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error("MAPBOX_ACCESS_TOKEN is not configured");
  }

  const encodedAddress = encodeURIComponent(address.trim());
  const url = `${MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${encodedAddress}.json?proximity=24.96,46.97&country=ro&limit=5&access_token=${token}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return null;
    }

    const feature = data.features[0];
    return {
      place_name: feature.place_name,
      coordinates: {
        lon: feature.center[0],
        lat: feature.center[1],
      },
      context: feature.context,
    };
  } catch (error) {
    console.error("Mapbox geocoding error:", error);
    throw error;
  }
}

/**
 * Reverse geocoding - convert coordinates to address
 */
export async function reverseGeocode(lat: number, lon: number) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error("MAPBOX_ACCESS_TOKEN is not configured");
  }

  const url = `${MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${token}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return null;
    }

    return {
      place_name: data.features[0].place_name,
      coordinates: {
        lat,
        lon,
      },
    };
  } catch (error) {
    console.error("Mapbox reverse geocoding error:", error);
    throw error;
  }
}

/**
 * Get distance and duration between two locations
 * Supports both address strings and coordinates
 */
export async function getDistance(
  fromLat: number | string,
  fromLon: number | string,
  toLat: number | string,
  toLon: number | string
) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error("MAPBOX_ACCESS_TOKEN is not configured");
  }

  // Coordinates format: lon1,lat1;lon2,lat2
  const coordinates = `${fromLon},${fromLat};${toLon},${toLat}`;
  const url = `${MAPBOX_API_BASE}/directions/v5/mapbox/driving/${coordinates}?steps=false&geometries=geojson&overview=full&access_token=${token}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found");
    }

    const route = data.routes[0];
    const distanceMeters = route.distance;
    const durationSeconds = route.duration;
    const distanceKm = Math.round((distanceMeters / 1000) * 100) / 100;

    // Format duration text similar to Google Maps
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.round((durationSeconds % 3600) / 60);
    let durationText = "";
    if (hours > 0) {
      durationText += `${hours} hour${hours > 1 ? "s" : ""} `;
    }
    durationText += `${minutes} min`;

    return {
      distanceKm,
      durationSeconds,
      durationText: durationText.trim(),
    };
  } catch (error) {
    console.error("Mapbox directions error:", error);
    throw error;
  }
}

/**
 * Autocomplete search for locations
 * Used for location input suggestions
 */
export async function searchLocations(query: string) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error("MAPBOX_ACCESS_TOKEN is not configured");
  }

  const encodedQuery = encodeURIComponent(query.trim());
  // Proximity set to Cluj-Napoca area (24.96°E, 46.97°N)
  // Also filter to Romania (RO country code)
  const url = `${MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${encodedQuery}.json?proximity=24.96,46.97&country=ro&limit=8&access_token=${token}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.features || []).map((feature: any) => ({
      id: feature.id,
      place_name: feature.place_name,
      lon: feature.center[0],
      lat: feature.center[1],
      relevance: feature.relevance,
      place_type: feature.place_type,
    }));
  } catch (error) {
    console.error("Mapbox search error:", error);
    return [];
  }
}
