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

  // Keep 'All vehicles' translatable; other type labels fall back to a humanized key.
  const vehicleTypes = [
    { key: null, label: t('allVehicles') },
    // Primary vehicle types shown in the UI
    { key: 'sedan', label: formatLabel('sedan') },
    { key: 'suv', label: formatLabel('suv') },
    { key: 'hatchback', label: formatLabel('hatchback') },
    { key: 'sports', label: formatLabel('sports') },
    { key: 'truck', label: formatLabel('truck') },
    { key: 'van', label: formatLabel('van') }
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