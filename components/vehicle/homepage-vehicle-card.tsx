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

  const [showOverlay, setShowOverlay] = React.useState(false);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  // Detect touch devices so we can change click behavior there
  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Combine several heuristics for better coverage across devices/browsers
        const hasTouchPoints = (navigator as any).maxTouchPoints > 0;
        const hasTouchEvent = 'ontouchstart' in window;
        const prefersNoHover = window.matchMedia ? window.matchMedia("(hover: none) and (pointer: coarse)").matches : false;

        setIsTouchDevice(Boolean(hasTouchPoints || hasTouchEvent || prefersNoHover));

        // Listen for changes to the hover media query (for devices that can change)
        if (window.matchMedia) {
          const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
          const listener = (e: MediaQueryListEvent) => setIsTouchDevice(Boolean((navigator as any).maxTouchPoints > 0 || 'ontouchstart' in window || e.matches));
          if (mq.addEventListener) mq.addEventListener("change", listener);
          else if ((mq as any).addListener) (mq as any).addListener(listener);
          return () => {
            if (mq.removeEventListener) mq.removeEventListener("change", listener);
            else if ((mq as any).removeListener) (mq as any).removeListener(listener);
          };
        }
      }
    } catch (err) {
      // fallback: assume non-touch
      setIsTouchDevice(false);
    }
  }, []);

  const handleCardClick = (e?: React.MouseEvent) => {
    // On touch devices: first tap shows overlay; second tap (when overlay visible) navigates to details.
    if (isTouchDevice) {
      e?.stopPropagation();
      if (!showOverlay) {
        setShowOverlay(true);
        return;
      }
      // If overlay already visible, navigate to details
      window.location.href = carDetailsUrl;
      return;
    }

    // Non-touch: go to details as before
    window.location.href = carDetailsUrl;
  };

  return (
    <div 
      className="relative bg-card-darker dark:bg-card-darker rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group cursor-pointer"
      onClick={handleCardClick}
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
        
        {/* Hover/Touch Overlay with Car Details */}
        <div className={
          `absolute inset-0 bg-black/80 transition-all duration-300 flex flex-col justify-center items-center text-white p-4 sm:p-6 ` +
          // Show overlay when hovering (desktop) OR when toggled on touch devices
          `${showOverlay ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 group-active:opacity-100`
        } style={{ pointerEvents: showOverlay ? 'auto' : undefined }}>
          {/* Car Specifications */}
          <div className="space-y-3 text-center">
            <div className="grid grid-cols-2 gap-4 w-full text-sm">
              <div className="flex items-center justify-center space-x-2">
                <CarFront className="h-4 w-4 flex-shrink-0" />
                <span>{vehicle.year || t('notAvailable')}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Icon iconNode={gearbox} className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{vehicle.transmission || t('notAvailable')}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Cog className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{vehicle.engineCapacity ? `${vehicle.engineCapacity.toFixed(1)}L` : t('notAvailable')}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Fuel className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{vehicle.fuelType || t('notAvailable')}</span>
              </div>
            </div>

            {/* Pricing removed from homepage hover overlay per UX requirement */}
            
            {/* Book Now Button */}
            <div className="mt-4">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2"
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {vehicle.make} {vehicle.model}
        </h3>
        {vehicle.class && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {vehicle.class}
          </p>
        )}
      </div>
    </div>
  );
}

export default HomepageVehicleCard;