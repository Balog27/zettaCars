"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface VehicleTypeNavigationProps {
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
}

export function VehicleTypeNavigation({ selectedType, onTypeChange }: VehicleTypeNavigationProps) {
  const t = useTranslations('vehicleTypes');

  const vehicleTypes = [
    { key: null, label: t('allVehicles') },
    // Keys are normalized to lowercase to match `vehicle.type` and `vehicle.class` values
    { key: 'compact', label: 'Compact' },
    { key: 'comfort', label: 'Comfort' },
    { key: 'business', label: 'Business' },
    { key: 'suv', label: 'SUV' },
    { key: 'premium', label: 'Premium' },
    { key: 'van', label: 'Van' }
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