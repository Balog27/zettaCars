/**
 * Transfer pricing calculation logic
 */

export type VehicleCategory = 'standard' | 'van';
export type RideType = 'one-way' | 'round-trip';

export const WAITING_HOUR_PRICE = 20; // EUR/hour

export const RATES = {
  standard: [
    { min: 0, max: 50, rate: 1.50 },
    { min: 51, max: 150, rate: 1.35 },
    { min: 151, max: 300, rate: 1.20 },
    { min: 301, max: Infinity, rate: 1.10 },
  ],
  van: [
    { min: 0, max: 50, rate: 2.00 },
    { min: 51, max: 150, rate: 1.85 },
    { min: 151, max: 300, rate: 1.70 },
    { min: 301, max: Infinity, rate: 1.60 },
  ],
};

export function getRatePerKm(totalDistanceKm: number, category: VehicleCategory): number {
  const tier = RATES[category].find(r => totalDistanceKm >= r.min && totalDistanceKm <= r.max);
  return tier ? tier.rate : RATES[category][RATES[category].length - 1].rate;
}

export function calculateTransferPrice(
  totalDistanceKm: number,
  category: VehicleCategory,
  rideType: RideType,
  waitingTotalHours: number,
  options?: {
    isCluj?: boolean;
    fixedPrices?: {
      standard: number;
      van: number;
      premium?: number;
    };
  }
) {
  let transportCost: number;
  let ratePerKm = getRatePerKm(totalDistanceKm, category);
  let isFixedPrice = false;

  if (options?.isCluj && options.fixedPrices) {
    transportCost = options.fixedPrices[category] || 0;
    isFixedPrice = true;
  } else {
    transportCost = totalDistanceKm * ratePerKm;
    
    // If the calculated price is lower than the fixed price for this category, use the fixed price instead
    if (options?.fixedPrices && options.fixedPrices[category] && transportCost < options.fixedPrices[category]) {
      transportCost = options.fixedPrices[category];
      isFixedPrice = true;
    }
  }

  const oneWayCost = transportCost;
  let finalTransportCost: number;
  let waitingCost: number;

  if (rideType === 'round-trip') {
    if (waitingTotalHours >= 4) {
      // Driver waits >= 4h at destination → charge full round trip, no waiting surcharge
      finalTransportCost = oneWayCost * 2;
      waitingCost = 0;
    } else {
      // Driver waits < 4h (or not at all) → one-way fare + hourly waiting cost
      finalTransportCost = oneWayCost;
      waitingCost = waitingTotalHours * WAITING_HOUR_PRICE;
    }
  } else {
    // One-way trip
    finalTransportCost = oneWayCost;
    waitingCost = waitingTotalHours * WAITING_HOUR_PRICE;
  }

  return {
    ratePerKm: (options?.isCluj || isFixedPrice) ? 0 : ratePerKm,
    transportCost: finalTransportCost,
    waitingCost,
    total: Math.round((finalTransportCost + waitingCost) * 100) / 100,
    isFixedPrice,
  };
}
