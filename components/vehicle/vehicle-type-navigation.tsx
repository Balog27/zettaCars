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
    { key: 'Luxury Sedan', label: t('luxurySedan') },
    { key: 'Executive Sedan', label: t('executiveSedan') },
    { key: 'Luxury SUV', label: t('luxurySUV') },
    { key: 'Premium Sedan', label: t('premiumSedan') },
    { key: 'Sport SUV', label: t('sportSUV') },
    { key: 'Electric Luxury', label: t('electricLuxury') }
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
              : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-primary hover:bg-primary/5'
            }
          `}
        >
          {type.label}
        </Button>
      ))}
    </div>
  );
}