"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface VehicleTypeNavigationProps {
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
}

export function VehicleTypeNavigation({ selectedType, onTypeChange }: VehicleTypeNavigationProps) {
  const t = useTranslations('vehicleTypes');
  // Helper to format fallback labels (e.g. "hatchback" -> "Hatchback")
  const formatLabel = (k?: string | null) => {
    if (!k) return '';
    return k
      .split(/[-_\s]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  // Compact categories used in the UI. These map to one or more underlying
  // stored `type` values in the dataset. The key is what the navigation
  // returns; the page that consumes the selection should expand these keys
  // into the underlying types when filtering.
  const vehicleTypes = [
    { key: null, label: t('allVehicles') },
    { key: 'comfort', label: t('comfort') || formatLabel('comfort') },
    { key: 'business', label: t('business') || formatLabel('business') },
    { key: 'suv', label: t('suv') || formatLabel('suv') },
    { key: 'premium', label: t('premium') || formatLabel('premium') },
    { key: 'van', label: t('van') || formatLabel('van') }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 w-full">
      {vehicleTypes.map((type) => (
        <Button
          key={type.key || 'all'}
          variant={selectedType === type.key ? "default" : "outline"}
          size="lg"
          onClick={() => onTypeChange(type.key)}
          className={`
            transition-all duration-200 font-medium py-3 px-4 h-auto whitespace-nowrap
            ${selectedType === type.key 
                ? 'bg-primary text-white border-primary shadow-sm' 
                : 'bg-white text-muted-foreground border-border hover:border-primary hover:text-primary hover:bg-primary/5 dark:bg-card'
              }
          `}
        >
          {type.label}
        </Button>
      ))}
    </div>
  );
}