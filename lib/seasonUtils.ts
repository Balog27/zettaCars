import { Id } from "../convex/_generated/dataModel";

// Type definitions matching the Convex schema
export type Season = {
  _id: Id<"seasons">;
  _creationTime: number;
  name: string;
  description?: string;
  multiplier: number;
  periods: Array<{
    startDate: string; // ISO date string "2024-06-01"
    endDate: string; // ISO date string "2024-07-30"
    description?: string;
  }>;
  isActive: boolean;
};

export type CurrentSeason = {
  _id: Id<"currentSeason">;
  _creationTime: number;
  seasonId: Id<"seasons">;
  setAt: number;
  setBy?: string;
  season: Season;
};

/**
 * Convert a Date object to ISO date string (YYYY-MM-DD)
 */
export function toDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Check if a date falls within a season period
 */
function isDateInPeriod(date: string, period: { startDate: string; endDate: string }): boolean {
  const checkDate = new Date(date);
  const startDate = new Date(period.startDate);
  const endDate = new Date(period.endDate);
  return checkDate >= startDate && checkDate <= endDate;
}

/**
 * Check if any date in a range falls within a season period
 */
function doesDateRangeOverlapWithPeriod(
  startDate: string,
  endDate: string,
  period: { startDate: string; endDate: string }
): boolean {
  const rangeStart = new Date(startDate);
  const rangeEnd = new Date(endDate);
  const periodStart = new Date(period.startDate);
  const periodEnd = new Date(period.endDate);
  
  // Check if ranges overlap
  return rangeStart <= periodEnd && rangeEnd >= periodStart;
}

/**
 * Calculate the seasonal multiplier for a date range
 * Returns the multiplier from the season that has the most overlap with the date range,
 * or falls back to the current season multiplier if no active season periods match.
 */
export function calculateMultiplierForDateRange(
  startDate: string,
  endDate: string,
  activeSeasons: Season[],
  currentSeason: CurrentSeason | null
): {
  multiplier: number;
  seasonId?: Id<"seasons">;
  seasonName?: string;
} {
  // Check each active season to see if any of its periods overlap with the date range
  let bestMatch: { season: Season; overlapDays: number } | null = null;
  
  for (const season of activeSeasons) {
    if (!season.isActive) continue;
    
    for (const period of season.periods) {
      if (doesDateRangeOverlapWithPeriod(startDate, endDate, period)) {
        // Calculate overlap days
        const rangeStart = new Date(startDate);
        const rangeEnd = new Date(endDate);
        const periodStart = new Date(period.startDate);
        const periodEnd = new Date(period.endDate);
        
        const overlapStart = rangeStart > periodStart ? rangeStart : periodStart;
        const overlapEnd = rangeEnd < periodEnd ? rangeEnd : periodEnd;
        const overlapDays = Math.max(0, Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        
        // Keep track of the season with the most overlap
        if (!bestMatch || overlapDays > bestMatch.overlapDays) {
          bestMatch = { season, overlapDays };
        }
      }
    }
  }
  
  // If we found a matching season period, use its multiplier
  if (bestMatch) {
    return {
      multiplier: bestMatch.season.multiplier,
      seasonId: bestMatch.season._id,
      seasonName: bestMatch.season.name,
    };
  }
  
  // Fall back to current season multiplier if no period matches
  if (currentSeason?.season) {
    return {
      multiplier: currentSeason.season.multiplier,
      seasonId: currentSeason.season._id,
      seasonName: currentSeason.season.name,
    };
  }
  
  // Default to 1.0 if no season is active
  return {
    multiplier: 1.0,
  };
}

