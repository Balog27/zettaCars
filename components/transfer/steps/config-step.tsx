"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Trash2, Users, ArrowRight, MapPin, Route, Info, Globe } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { LocationAutocomplete } from '../location-autocomplete';
import { VehicleCategory, RideType, calculateTransferPrice } from '@/lib/transfer-pricing';
import { DateTimePicker } from '@/components/date-time-picker';
import { TransferFormData } from '../transfer-wizard';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useTranslations } from 'next-intl';

type ConfigStepProps = {
  data: TransferFormData;
  onUpdate: (data: Partial<TransferFormData>) => void;
  onNext: () => void;
};

export function ConfigStep({ data, onUpdate, onNext }: ConfigStepProps) {
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const transferPricing = useQuery(api.transfers.getTransferPricing);
  const t = useTranslations("transfersPage");

  const addSegment = () => {
    const lastSegment = data.segments[data.segments.length - 1];
    onUpdate({
      segments: [...data.segments, { from: lastSegment.to, to: '', distanceKm: 0, waitingTime: 0 }],
    });
  };

  const removeSegment = (index: number) => {
    if (data.segments.length > 1) {
      const newSegments = data.segments.filter((_, i) => i !== index);
      onUpdate({ segments: newSegments });
    }
  };

  const updateSegment = async (index: number, field: string, value: any) => {
    const newSegments = [...data.segments];
    (newSegments[index] as any)[field] = value;

    // If both 'from' and 'to' are present, calculate distance
    if ((field === 'from' || field === 'to') && newSegments[index].from && newSegments[index].to) {
      calculateDistance(index, newSegments[index].from, newSegments[index].to);
    } else {
      onUpdate({ segments: newSegments });
    }
  };

  const calculateDistance = async (index: number, from: string, to: string) => {
    setLoading(prev => ({ ...prev, [index]: true }));
    try {
      const response = await fetch('/api/transfer-distance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: from, destination: to }),
      });
      const result = await response.json();
      if (result.distanceKm) {
        const newSegments = [...data.segments];
        newSegments[index].distanceKm = result.distanceKm;
        newSegments[index].durationText = result.durationText;
        onUpdate({ segments: newSegments });
      }
    } catch (error) {
      console.error('Distance calculation error:', error);
    } finally {
      setLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  const totalDistance = data.segments.reduce((acc, s) => acc + s.distanceKm, 0);
  // For round-trips, include the last segment's waiting time too
  // (the driver waits at the destination before returning)
  const totalWaitingHours = data.segments.reduce((acc, s, i) => {
    if (data.rideType === 'one-way' && i === data.segments.length - 1) return acc;
    return acc + s.waitingTime;
  }, 0);

  const pricing = useMemo(() => {
    if (!transferPricing) return calculateTransferPrice(totalDistance, data.category, data.rideType, totalWaitingHours);

    const CLUJ_KEYWORDS = ["cluj-napoca", "napoca", "clj airport", "aeroport cluj", "cluj airport"];
    const isWithinCluj = data.segments.every(s => {
      const from = s.from.toLowerCase();
      const to = s.to.toLowerCase();
      const fromInCluj = CLUJ_KEYWORDS.some(k => from.includes(k));
      const toInCluj = CLUJ_KEYWORDS.some(k => to.includes(k));
      return fromInCluj && toInCluj;
    });

    return calculateTransferPrice(
      totalDistance,
      data.category,
      data.rideType,
      totalWaitingHours,
      {
        isCluj: isWithinCluj,
        fixedPrices: transferPricing.fixedPrices as any
      }
    );
  }, [totalDistance, data.category, data.rideType, totalWaitingHours, transferPricing, data.segments]);

  const canContinue = data.segments.every(s => s.from && s.to && s.distanceKm > 0) && data.date && data.passengers > 0;

  return (
    <div className="bg-transparent">
      <div className="pt-0 pb-6 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("summary.config.title") ?? "Configurează transferul"}</h2>
      </div>
      <div className="space-y-8">

        {/* Vehicle Category Selection with Photos */}
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 block">{t("summary.config.vehicleCategory") ?? "Categorie vehicul"}</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <button
                onClick={() => onUpdate({ category: 'standard' })}
                disabled={data.passengers >= 4}
                suppressHydrationWarning
                className={`group relative w-full overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                  data.category === 'standard'
                     ? 'border-pink-500 bg-white dark:bg-zinc-950/60 scale-[1.02]'
                    : 'border-gray-200 dark:border-zinc-800 hover:border-pink-300 dark:hover:border-pink-700 bg-white dark:bg-zinc-950/30'
                } ${data.passengers >= 4 ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
              >
                <div className="relative h-32 sm:h-40 overflow-hidden bg-gray-100 dark:bg-zinc-900/30">
                  <img 
                    src="/eclass.jpg" 
                    alt="Standard - Mercedes E-Class" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                <div className={`px-4 py-3 text-center font-semibold transition-colors ${
                  data.category === 'standard'
                    ? 'text-pink-500'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {t("booking.standard") ?? "Standard"}
                  <span className="block text-xs font-normal opacity-80 mt-0.5">{t("summary.config.passengerRange1to3") ?? "1–3 pasageri"}</span>
                </div>
              </button>
              {data.passengers >= 4 && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-zinc-800 text-white text-[10px] px-2 py-1 rounded-full shadow-lg flex items-center gap-1 border border-zinc-700">
                    <Info className="w-3 h-3 text-pink-400" />
                    {t("summary.config.requiresVan") ?? "Necesită VAN"}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onUpdate({ category: 'van' })}
              suppressHydrationWarning
              className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                data.category === 'van'
                  ? 'border-pink-500 bg-white dark:bg-black scale-[1.02]'
                  : 'border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700 bg-white dark:bg-black'
              }`}
            >
              <div className="relative h-32 sm:h-40 overflow-hidden bg-gray-100 dark:bg-black">
                <img 
                  src="/van.jpg" 
                  alt="VAN - Mercedes V-Class" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </div>
              <div className={`px-4 py-3 text-center font-semibold transition-colors ${
                data.category === 'van'
                  ? 'text-pink-500'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {t("booking.van") ?? "VAN"}
                <span className="block text-xs font-normal opacity-80 mt-0.5">{t("summary.config.passengerRange4to8") ?? "4–8 pasageri"}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Ride Type Selection */}
        <div className="flex gap-3">
           <button 
            onClick={() => onUpdate({ rideType: 'one-way' })}
            suppressHydrationWarning
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
              data.rideType === 'one-way'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                : 'bg-gray-100 dark:bg-zinc-950/60 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-900/80 shadow-inner'
            }`}
           >
             {t("summary.oneWay") ?? "Un sens"}
           </button>
           <button 
            onClick={() => onUpdate({ rideType: 'round-trip' })}
            suppressHydrationWarning
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
              data.rideType === 'round-trip'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                : 'bg-gray-100 dark:bg-zinc-950/60 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-900/80 shadow-inner'
             }`}
           >
             {t("summary.roundTrip") ?? "Dus-întors"}
           </button>
        </div>

        {/* International Transfer Toggle */}
        <div className="flex items-center justify-between p-5 bg-white dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/80 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-50 dark:bg-pink-900/20 rounded-xl text-pink-500">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <Label htmlFor="international-toggle" className="text-sm font-bold block mb-0.5">
                {t("summary.config.isInternational") ?? "Transfer în afara României"}
              </Label>
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                {t("summary.config.isInternationalDescription") ?? "Pentru rute externe (ex: Budapesta, Belgrad)"}
              </span>
            </div>
          </div>
          <Switch
            id="international-toggle"
            checked={data.isInternational}
            onCheckedChange={(checked) => onUpdate({ isInternational: checked })}
          />
        </div>

        {/* Popular International Destinations */}
        {data.isInternational && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">
              {t("summary.config.popularDestinations") ?? "DESTINAȚII INTERNAȚIONALE POPULARE"}
            </Label>
            <div className="flex flex-wrap gap-2">
              {["Budapest, Hungary", "Belgrade, Serbia", "Vienna, Austria", "Debrecen, Hungary"].map((dest) => (
                <button
                  key={dest}
                  onClick={() => updateSegment(data.segments.length - 1, 'to', dest)}
                  className="px-4 py-2 text-xs font-semibold bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full hover:border-pink-500 hover:text-pink-500 dark:hover:border-pink-500 transition-all shadow-sm"
                >
                  {dest.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Segments */}
        <div className="space-y-5">
          {data.segments.map((segment, index) => (
            <div key={index} className="relative pl-8 space-y-3">
              {/* Vertical line indicator */}
              <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-gradient-to-b from-pink-400 to-pink-200 dark:from-pink-500 dark:to-pink-800">
                <div className="absolute top-0 left-1/2 -ml-1.5 w-3 h-3 rounded-full border-2 border-pink-500 bg-white dark:bg-black shadow-sm" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5" />
                  {t("summary.segment") ?? "Segment"} {index + 1}
                </span>
                {data.segments.length > 1 && (
                  <button onClick={() => removeSegment(index)} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 p-5 bg-white dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <LocationAutocomplete
                  value={segment.from}
                  isInternational={data.isInternational}
                  onChange={(val) => updateSegment(index, 'from', val)}
                  label={t("summary.pickupAddress") ?? "PORNIRE"}
                  placeholder={t("summary.pickupPlaceholder") ?? "Introduceți adresa de pornire"}
                />
                <LocationAutocomplete
                  value={segment.to}
                  isInternational={data.isInternational}
                  onChange={(val) => updateSegment(index, 'to', val)}
                  label={t("summary.dropoffAddress") ?? "DESTINAȚIE"}
                  placeholder={t("summary.dropoffPlaceholder") ?? "Introduceți adresa de destinație"}
                />
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-4">
                    {loading[index] ? (
                      <span className="text-sm text-pink-400 animate-pulse flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {t("summary.recalculating") ?? "Se calculează distanța..."}
                      </span>
                    ) : segment.distanceKm > 0 ? (
                      <div className="flex items-baseline gap-2">
                         <span className="px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full text-sm font-bold">
                           {Number(segment.distanceKm).toFixed(2)} {t("summary.km") ?? "km"}
                         </span>
                         <span className="text-sm text-gray-500">{segment.durationText}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Waiting time:
                    - For one-way: all segments except the last
                    - For round-trip: ALL segments (driver waits at destination before returning) */}
                {(data.rideType === 'round-trip' || index < data.segments.length - 1) && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800/50">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t("summary.config.waitingAtDestination") ?? "Staționare la destinație"}</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateSegment(index, 'waitingTime', Math.max(0, segment.waitingTime - 0.5))}
                        className="p-1.5 rounded-full border border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/30 text-pink-500 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold min-w-[3rem] text-center text-gray-900 dark:text-white">{segment.waitingTime}h</span>
                      <button 
                        onClick={() => updateSegment(index, 'waitingTime', segment.waitingTime + 0.5)}
                        className="p-1.5 rounded-full border border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/30 text-pink-500 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}


          <Button 
            variant="outline" 
            onClick={addSegment} 
            suppressHydrationWarning
            className="w-full py-6 border-dashed border-2 rounded-2xl text-gray-400 hover:text-pink-500 hover:border-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-900/10 transition-all font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" /> {t("summary.addDestination") ?? "Adaugă destinație"}
          </Button>
        </div>

        {/* Date, Time, Passengers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
          <DateTimePicker
            id="transfer-pickup-datetime"
            label={t("booking.transferDate") ?? "DATA ȘI ORA CURSEI"}
            dateState={data.date}
            setDateState={(d) => onUpdate({ date: d })}
            timeState={data.time}
            setTimeState={(t) => onUpdate({ time: t })}
            minDate={new Date()}
          />
          
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("summary.numberOfPersons") ?? "NUMĂR PASAGERI (1–8)"}</Label>
            <div className="flex items-center p-1 bg-white dark:bg-zinc-950/60 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-inner">
              <button 
                onClick={() => {
                  const newVal = Math.max(1, (data.passengers || 1) - 1);
                  onUpdate({ passengers: newVal });
                }}
                className="p-2.5 rounded-lg border border-pink-100 dark:border-pink-900/40 hover:bg-pink-50 dark:hover:bg-pink-900/20 text-pink-500 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <div className="flex-1 flex items-center justify-center gap-2">
                <Users className="w-4 h-4 text-pink-400" />
                <input 
                  type="text" 
                  inputMode="numeric"
                  suppressHydrationWarning
                  value={data.passengers === 0 ? "" : data.passengers}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    const numVal = val === "" ? 0 : parseInt(val);
                    if (numVal <= 8) {
                      const updates: Partial<TransferFormData> = { passengers: numVal };
                      if (numVal >= 4 && data.category === 'standard') {
                        updates.category = 'van';
                      }
                      onUpdate(updates);
                    }
                  }}
                  className="w-12 bg-transparent border-none focus:ring-0 text-center text-sm font-bold p-0"
                />
              </div>

              <button 
                onClick={() => {
                  const newVal = Math.min(8, (data.passengers || 0) + 1);
                  const updates: Partial<TransferFormData> = { passengers: newVal };
                  if (newVal >= 4 && data.category === 'standard') {
                    updates.category = 'van';
                  }
                  onUpdate(updates);
                }}
                className="p-2.5 rounded-lg border border-pink-100 dark:border-pink-900/40 hover:bg-pink-50 dark:hover:bg-pink-900/20 text-pink-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Summary Box */}
        <div className="p-6 bg-gradient-to-br from-pink-50/50 to-white dark:from-zinc-950/80 dark:to-zinc-900/40 rounded-3xl border border-pink-100 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-3">
          {!pricing.isFixedPrice && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t("summary.totalDistance") ?? "Distanță totală"}</span>
                <span className="font-bold text-gray-900 dark:text-white">{Number(totalDistance).toFixed(2)} {t("summary.km") ?? "km"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t("summary.ratePerKm") ?? "Tarif/km"} ({data.category === 'standard' ? (t("booking.standard") ?? 'Standard') : (t("booking.van") ?? 'VAN')})</span>
                <span className="font-bold text-gray-900 dark:text-white">{pricing.ratePerKm.toFixed(2)} €</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">{t("summary.transportCost") ?? "Cost transport"}</span>
            <span className="font-bold text-gray-900 dark:text-white">{pricing.transportCost.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">{t("summary.waitingTime") ?? "Staționări"}</span>
            <span className="font-bold text-gray-900 dark:text-white">{pricing.waitingCost.toFixed(2)} €</span>
          </div>
          <div className="pt-4 border-t border-pink-200 dark:border-zinc-800 flex justify-between items-end">
            <span className="text-lg font-bold text-gray-900 dark:text-white">{t("summary.totalEstimative") ?? "Total estimat"}</span>
            <div className="text-right">
              <span className="text-3xl font-black text-pink-500">{Math.round(pricing.total)}</span>
              <span className="text-xl font-bold text-pink-500 ml-1">€</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={onNext} 
          disabled={!canContinue}
          suppressHydrationWarning
          className="w-full py-8 text-lg font-bold !bg-pink-500 hover:!bg-pink-600 !text-white rounded-2xl transition-all shadow-xl shadow-pink-500/20 hover:shadow-pink-500/30 group"
        >
          {t("summary.proceed") ?? "Continuă cu datele personale"}
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
