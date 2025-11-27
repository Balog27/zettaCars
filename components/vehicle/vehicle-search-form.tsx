"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LocationPicker } from "@/components/location-picker";
import { DateTimePicker } from "@/components/date-time-picker";
import { SearchData } from "@/lib/searchStorage";
import { useTranslations } from 'next-intl';

interface VehicleSearchFormProps {
  searchState: SearchData & { isHydrated: boolean };
  updateSearchField: <K extends keyof SearchData>(field: K, value: SearchData[K]) => void;
  isLoading?: boolean;
}

export function VehicleSearchForm({
  searchState,
  updateSearchField,
  isLoading = false,
}: VehicleSearchFormProps) {
  const t = useTranslations('vehicleSearchForm');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <Card className="shadow-lg rounded-lg">
      <CardContent className="p-8 min-h-[220px] min-w-0">
        {/* Locations on the first row, dates on the second row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="min-w-0">
            <LocationPicker
              id="deliveryLocation"
              label={t('pickupLocation')}
              value={searchState.deliveryLocation || ""}
              onValueChange={(value) => updateSearchField('deliveryLocation', value)}
              placeholder={t('selectPickup')}
              disabled={isLoading}
            />
          </div>

          <div className="min-w-0">
            <LocationPicker
              id="restitutionLocation"
              label={t('returnLocation')}
              value={searchState.restitutionLocation || ""}
              onValueChange={(value) => updateSearchField('restitutionLocation', value)}
              placeholder={t('selectReturn')}
              disabled={isLoading}
            />
          </div>

          <div className="min-w-0">
            <DateTimePicker
              id="pickupDate"
              label={t('pickupDateTime')}
              disabledDateRanges={{ before: today }}
              dateState={searchState.pickupDate}
              setDateState={(date) => updateSearchField('pickupDate', date)}
              timeState={searchState.pickupTime || null}
              setTimeState={(time) => updateSearchField('pickupTime', time)}
              minDate={today}
              isLoading={isLoading}
            />
          </div>

          <div className="min-w-0">
            <DateTimePicker
              id="returnDate"
              label={t('returnDateTime')}
              dateState={searchState.returnDate}
              setDateState={(date) => updateSearchField('returnDate', date)}
              timeState={searchState.returnTime || null}
              setTimeState={(time) => updateSearchField('returnTime', time)}
              minDate={searchState.pickupDate || today}
              disabledDateRanges={searchState.pickupDate ? { before: searchState.pickupDate } : { before: today }}
              isLoading={isLoading || !searchState.pickupDate}
              pickupDate={searchState.pickupDate}
              pickupTime={searchState.pickupTime || null}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 