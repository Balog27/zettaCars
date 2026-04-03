import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Vehicle } from "@/types/vehicle";
import { useTranslations } from 'next-intl';

export interface UseHomepageFeaturedVehiclesReturn {
  vehiclesToDisplay: Vehicle[];
  currentTitle: string;
  isLoading: boolean;
  error: boolean;
}

export function useHomepageFeaturedVehicles(): UseHomepageFeaturedVehiclesReturn {
  const t = useTranslations('common');

  // Try to get featured cars from backend first
  const featuredVehicles = useQuery(api.featuredCars.getFeaturedVehicles);
  
  // Fallback to random vehicles if no featured cars are set
  const fallbackVehiclesQuery = useQuery(
    api.vehicles.getAll, 
    featuredVehicles?.length === 0 ? { paginationOpts: { numItems: 3, cursor: null } } : "skip"
  );

  const isLoading = featuredVehicles === undefined || (featuredVehicles?.length === 0 && fallbackVehiclesQuery === undefined);
  const error = featuredVehicles === null || (featuredVehicles?.length === 0 && fallbackVehiclesQuery === null);
  
  // Determine vehicles to display
  let vehiclesToDisplay: Vehicle[] = [];
  let currentTitle = t('loading');

  if (!isLoading && !error) {
    if (featuredVehicles && featuredVehicles.length > 0) {
      // Use featured cars from backend
      vehiclesToDisplay = featuredVehicles;
      currentTitle = t('featuredCars');
    } else if (fallbackVehiclesQuery) {
      // Fallback may return either an array or a paginated object with `.page`.
      if (Array.isArray(fallbackVehiclesQuery)) {
        vehiclesToDisplay = fallbackVehiclesQuery as Vehicle[];
      } else if ((fallbackVehiclesQuery as any).page) {
        vehiclesToDisplay = (fallbackVehiclesQuery as any).page as Vehicle[];
      }
      currentTitle = vehiclesToDisplay.length > 0 ? t('latestCars') : t('noFeaturedCarsAvailable');
    } else {
      vehiclesToDisplay = [];
      currentTitle = t('noFeaturedCarsAvailable');
    }
  }

  return {
    vehiclesToDisplay,
    currentTitle,
    isLoading,
    error
  };
} 
