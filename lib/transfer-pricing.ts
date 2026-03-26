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
