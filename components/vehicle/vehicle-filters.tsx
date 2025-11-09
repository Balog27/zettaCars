"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleTypeNavigation } from "@/components/vehicle/vehicle-type-navigation";
import { Vehicle } from "@/types/vehicle";
import { useTranslations } from 'next-intl';

interface VehicleFiltersProps {
  allVehicles: Vehicle[] | null;
  onFilterChange: (filteredVehicles: Vehicle[] | null) => void;
}

export function VehicleFilters({ allVehicles, onFilterChange }: VehicleFiltersProps) {
  const t = useTranslations('filters');

  const [brandFilter, setBrandFilter] = React.useState<string>("all");
  const [fuelTypeFilter, setFuelTypeFilter] = React.useState<string>("all");
  const [transmissionFilter, setTransmissionFilter] = React.useState<string>("all");
  const [selectedType, setSelectedType] = React.useState<string | null>(null);

  // Extract unique brands
  const brands = React.useMemo(() => {
    if (!allVehicles) return [];
    const uniqueBrands = new Set(allVehicles.map(v => v.make).filter(Boolean));
    return ["all", ...Array.from(uniqueBrands)];
  }, [allVehicles]);

  // Extract unique fuel types
  const fuelTypes = React.useMemo(() => {
    if (!allVehicles) return [];
    const uniqueFuelTypes = new Set(allVehicles.map(v => v.fuelType).filter(Boolean) as string[]);
    return ["all", ...Array.from(uniqueFuelTypes)];
  }, [allVehicles]);

  // Extract unique transmissions
  const transmissions = React.useMemo(() => {
    if (!allVehicles) return [];
    const uniqueTransmissions = new Set(allVehicles.map(v => v.transmission).filter(Boolean) as string[]); 
    return ["all", ...Array.from(uniqueTransmissions)];
  }, [allVehicles]);

  

  React.useEffect(() => {
    if (!allVehicles) {
      onFilterChange(null);
      return;
    }

    let filtered = [...allVehicles];

    if (brandFilter !== "all") {
      filtered = filtered.filter(v => v.make === brandFilter);
    }
    if (fuelTypeFilter !== "all") {
      filtered = filtered.filter(v => v.fuelType === fuelTypeFilter);
    }
    if (transmissionFilter !== "all") {
      filtered = filtered.filter(v => v.transmission === transmissionFilter);
    }

    if (selectedType) {
      filtered = filtered.filter(v => v.type === selectedType);
    }

    onFilterChange(filtered);
  }, [allVehicles, brandFilter, fuelTypeFilter, transmissionFilter, selectedType, onFilterChange]);

  if (!allVehicles || allVehicles.length === 0) {
    return null; // Don't show filters if there are no vehicles to filter
  }

  return (
    <Card className="mb-6 shadow-lg bg-card">
      <CardContent className="p-4">
        {/* Make filters occupy the full width: 3 columns on small+ screens so the three selects span the card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="brand-filter" className="text-sm font-medium text-primary">{t('brand')}</Label>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger id="brand-filter" className="mt-1 w-full">
                <SelectValue placeholder={t('selectBrand')} />
              </SelectTrigger>
              <SelectContent>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand} className="capitalize">
                    {brand === "all" ? t('allBrands') : brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fuel-type-filter" className="text-sm font-medium text-primary">{t('fuelType')}</Label>
            <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
              <SelectTrigger id="fuel-type-filter" className="mt-1 w-full">
                <SelectValue placeholder={t('selectFuelType')} />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map(fuel => (
                  <SelectItem key={fuel} value={fuel} className="capitalize">
                    {fuel === "all" ? t('allFuelTypes') : fuel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="transmission-filter" className="text-sm font-medium text-primary">{t('transmission')}</Label>
            <Select value={transmissionFilter} onValueChange={setTransmissionFilter}>
              <SelectTrigger id="transmission-filter" className="mt-1 w-full">
                <SelectValue placeholder={t('selectTransmission')} />
              </SelectTrigger>
              <SelectContent>
                {transmissions.map(trans => (
                  <SelectItem key={trans} value={trans} className="capitalize">
                    {trans === "all" ? t('allTransmissions') : trans}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type dropdown removed per request */}
        </div>

        {/* Re-add type buttons (VehicleTypeNavigation) so users can filter by type with individual buttons */}
        <div className="mt-4">
          <VehicleTypeNavigation selectedType={selectedType} onTypeChange={setSelectedType} />
        </div>
      </CardContent>
    </Card>
  );
} 
