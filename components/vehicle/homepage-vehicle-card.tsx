"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Cog, Fuel, CarFront, Icon } from "lucide-react";
import { gearbox } from '@lucide/lab';
import { Vehicle } from "@/types/vehicle";
import { buildReservationUrl, calculateVehiclePricingWithSeason, getPriceForDurationWithSeason } from "@/lib/vehicleUtils";
import { getBasePricePerDay } from "@/types/vehicle";
import { useSeasonalPricing } from "@/hooks/useSeasonalPricing";
import { useTranslations, useLocale } from 'next-intl';

interface HomepageVehicleCardProps {
  vehicle: Vehicle;
  pickupDate?: Date | null;
  returnDate?: Date | null;
  deliveryLocation?: string | null;
  restitutionLocation?: string | null;
  pickupTime?: string | null;
  returnTime?: string | null;
}

function buildCarDetailsUrl(vehicleId: string): string {
  return `/cars/${vehicleId}`;
}

export function HomepageVehicleCard({ 
  vehicle, 
  pickupDate, 
  returnDate, 
  deliveryLocation,
  restitutionLocation,
  pickupTime,
  returnTime 
}: HomepageVehicleCardProps) {
  // Always call hooks at the top level, before any early returns
  const t = useTranslations('vehicleCard');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  
  const imageUrl = useQuery(api.vehicles.getImageUrl, 
    vehicle?.mainImageId ? { imageId: vehicle.mainImageId } : "skip"
  );

  const { multiplier: currentMultiplier } = useSeasonalPricing();

  if (!vehicle || typeof vehicle._id !== "string") {
    return <div className="p-4 border rounded-lg shadow-md bg-card text-card-foreground">{tCommon('invalidData')}</div>;
  }

  const priceDetails = calculateVehiclePricingWithSeason(
    vehicle,
    currentMultiplier,
    pickupDate,
    returnDate,
    deliveryLocation || undefined,
    restitutionLocation || undefined,
    pickupTime,
    returnTime
  );

  // Calculate the current price per day based on rental duration
  const currentPricePerDay = React.useMemo(() => {
    if (priceDetails.days) {
      return getPriceForDurationWithSeason(vehicle, priceDetails.days, currentMultiplier);
    }
    // Use the base price tier (lowest minDays + highest pricePerDay) with seasonal adjustment
    const basePrice = getBasePricePerDay(vehicle);
    return Math.round(basePrice * currentMultiplier);
  }, [vehicle, priceDetails.days, currentMultiplier]);

  const currency = "EUR";

  const reservationUrl = buildReservationUrl(vehicle._id);

  const carDetailsUrl = buildCarDetailsUrl(vehicle._id);

  const handleImageClick = () => {
    // Navigate to car details page
    window.location.href = carDetailsUrl;
  };

  return (
    <div 
      className="relative bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group cursor-pointer"
      onClick={handleImageClick}
    >
      {/* Car Image */}
      <div className="aspect-[4/3] relative w-full bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <span className="text-sm">{tCommon('noImage')}</span>
          </div>
        )}
        
        {/* Hover Overlay with Car Details */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center text-white p-6">
          {/* Car Specifications */}
          <div className="space-y-3 text-center">
            <div className="flex justify-around items-center w-full text-sm">
              <div className="flex items-center space-x-2">
                <CarFront className="h-4 w-4" />
                <span>{vehicle.year || t('notAvailable')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon iconNode={gearbox} className="h-4 w-4" />
                <span>{vehicle.transmission || t('notAvailable')}</span>
              </div>
            </div>
            
            <div className="flex justify-around items-center w-full text-sm">
              <div className="flex items-center space-x-2">
                <Cog className="h-4 w-4" />
                <span>{vehicle.engineCapacity ? `${vehicle.engineCapacity.toFixed(1)}L` : t('notAvailable')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Fuel className="h-4 w-4" />
                <span>{vehicle.fuelType || t('notAvailable')}</span>
              </div>
            </div>

            {/* Pricing when dates are selected */}
            {pickupDate && returnDate && (
              <div className="mt-4 space-y-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {currentPricePerDay} {currency}
                  </div>
                  <div className="text-sm text-gray-300">{t('perDay')}</div>
                </div>
                {priceDetails.totalPrice !== null && priceDetails.days !== null && (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">
                      {t('totalFor', { 
                        days: priceDetails.days, 
                        plural: locale === 'ro' ? ((priceDetails.days === 1) ? "" : "le") : ((priceDetails.days === 1) ? "" : "s") 
                      })}: {priceDetails.totalPrice} {currency}
                    </div>
                    {priceDetails.totalLocationFees > 0 && (
                      <div className="text-xs text-gray-300">
                        +{priceDetails.totalLocationFees} {currency} {t('fees')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Book Now Button */}
            <div className="mt-4">
              <Button 
                className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-6 py-2"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={reservationUrl}>
                  {t('bookNow')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Car Brand and Model - Always Visible */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {vehicle.make} {vehicle.model}
        </h3>
        {vehicle.category && (
          <p className="text-sm text-gray-600 mt-1">
            {vehicle.category}
          </p>
        )}
      </div>
    </div>
  );
}

export default HomepageVehicleCard;