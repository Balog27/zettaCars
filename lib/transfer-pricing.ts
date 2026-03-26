/**
 * Transfer pricing calculation logic
 */

export type VehicleCategory = 'standard' | 'van';
export type RideType = 'one-way' | 'round-trip';

export const WAITING_HOUR_PRICE = 15; // EUR/hour

export const RATES = {
  standard: [
    { maxDist: 50, rate: 1.50 },
    { maxDist: 150, rate: 1.35 },
    { maxDist: 300, rate: 1.20 },
    { maxDist: Infinity, rate: 1.10 }
  ],
  van: [
    { maxDist: 50, rate: 2.00 },
    { maxDist: 150, rate: 1.85 },
    { maxDist: 300, rate: 1.70 },
    { maxDist: Infinity, rate: 1.60 }
  ]
};

export function getRatePerKm(totalDistanceKm: number, category: VehicleCategory): number {
  const categoryRates = RATES[category];
  const rateObj = categoryRates.find(r => totalDistanceKm <= r.maxDist) || categoryRates[categoryRates.length - 1];
  return rateObj.rate;
}

export function calculateTransferPrice(
  totalDistanceKm: number,
  category: VehicleCategory,
  rideType: RideType,
  waitingTotalHours: number
) {
  const ratePerKm = getRatePerKm(totalDistanceKm, category);
  
  let transportCost = totalDistanceKm * ratePerKm;
  if (rideType === 'round-trip') {
    transportCost *= 2;
  }
  
  const waitingCost = waitingTotalHours * WAITING_HOUR_PRICE;
  
  const total = transportCost + waitingCost;
  
  return {
    ratePerKm,
    transportCost,
    waitingCost,
    total: Math.round(total * 100) / 100
  };
}
