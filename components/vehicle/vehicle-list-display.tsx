"use client";

import { VehicleCard } from "@/components/vehicle/vehicle-card";
import { VehicleCardSkeleton } from "@/components/vehicle/vehicle-card-skeleton";
import { Vehicle } from "@/types/vehicle";
import { SearchData } from "@/lib/searchStorage";
import { useTranslations } from 'next-intl';
import { Separator } from "@/components/ui/separator";

interface VehicleListDisplayProps {
  vehicles: Vehicle[] | null;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  searchState: SearchData;
}

// Helper function to format type names for display
function formatTypeName(typeName: string | undefined): string {
  if (!typeName) return "Unclassified";
  return typeName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to group vehicles by type
function groupVehiclesByType(vehicles: Vehicle[]): Record<string, Vehicle[]> {
  const grouped: Record<string, Vehicle[]> = {};

  vehicles.forEach((vehicle) => {
    if (!vehicle || typeof vehicle._id !== 'string') {
      console.warn("Skipping invalid vehicle data:", vehicle);
      return;
    }

  // After migrating to compact categories, vehicle.type should directly hold
  // one of the compact values: comfort, business, suv, premium, van.
  const canonicalType = (vehicle.type || '').toString().toLowerCase();
  const mapped = canonicalType || 'unclassified';

    if (!grouped[mapped]) grouped[mapped] = [];
    grouped[mapped].push(vehicle);
  });

  return grouped;
}

// Define the order of compact categories for consistent display
const typeOrder = [
  'comfort',
  'compact',
  'business',
  'suv',
  'premium',
  'van',
  'unclassified'
] as const;

function VehicleTypeSection({
  typeName,
  vehicles,
  searchState,
}: {
  typeName: string;
  vehicles: Vehicle[];
  searchState: SearchData;
}) {
  // Map compact keys to nicer display names
  const displayMap: Record<string, string> = {
    comfort: 'Comfort',
    compact: 'Compact',
    business: 'Business',
    suv: 'SUV',
    premium: 'Premium',
    van: 'Van',
    unclassified: 'Other',
  };

  const displayName = displayMap[typeName] ?? formatTypeName(typeName);

  return (
    <div className="mb-12">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-foreground whitespace-nowrap">
          {displayName}
        </h2>
        <Separator className="flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle._id}
            vehicle={vehicle}
            pickupDate={searchState.pickupDate || null}
            returnDate={searchState.returnDate || null}
            deliveryLocation={searchState.deliveryLocation || null}
            restitutionLocation={searchState.restitutionLocation || null}
            pickupTime={searchState.pickupTime}
            returnTime={searchState.returnTime}
          />
        ))}
      </div>
    </div>
  );
}

function VehiclesByType({
  vehicles,
  searchState,
}: {
  vehicles: Vehicle[];
  searchState: SearchData;
}) {
  const groupedVehicles = groupVehiclesByType(vehicles);

  const availableTypes = typeOrder.filter(typeName => {
    const vehiclesInType = groupedVehicles[typeName];
    return vehiclesInType && vehiclesInType.length > 0;
  });

  return (
    <div>
      {availableTypes.map((typeName) => {
        const vehiclesInType = groupedVehicles[typeName];
        return (
          <VehicleTypeSection
            key={typeName}
            typeName={typeName}
            vehicles={vehiclesInType || []}
            searchState={searchState}
          />
        );
      })}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }, (_, index) => (
        <VehicleCardSkeleton key={index} />
      ))}
    </div>
  );
}

function getDisplayTitle(vehicles: Vehicle[] | null, isLoading: boolean, error: string | null, t: any): string {
  if (isLoading) return t('loadingVehicles');
  if (error) return t('errorLoadingVehicles');
  if (!vehicles || vehicles.length === 0) return t('noCarsFound');
  return t('availableCars');
}

export function VehicleListDisplay({
  vehicles,
  isLoading,
  isHydrated,
  error,
  searchState,
}: VehicleListDisplayProps) {
  const t = useTranslations('vehicleListDisplay');
  const displayTitle = getDisplayTitle(vehicles, isLoading, error, t);

  return (
    <div>
      {/* <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-center">
        {displayTitle}
      </h1> */}

      {error && (
        <div className="text-center mb-4">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Show skeleton loading while not hydrated or while loading */}
      {(!isHydrated || isLoading) && <LoadingSkeleton />}

      {/* Show error state */}
      {isHydrated && !isLoading && vehicles === null && error && (
        <p className="text-center text-destructive">
          {t('couldNotLoadVehicles')}
        </p>
      )}

      {/* Show empty state */}
      {isHydrated && !isLoading && vehicles !== null && vehicles.length === 0 && (
        <p className="text-center text-muted-foreground">
          {t('noVehiclesFoundMessage')}
        </p>
      )}

      {/* Show vehicles */}
      {isHydrated && !isLoading && vehicles && vehicles.length > 0 && (
        <VehiclesByType vehicles={vehicles} searchState={searchState} />
      )}
    </div>
  );
} 
