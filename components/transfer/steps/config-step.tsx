"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Trash2, Users, ArrowRight, MapPin, Route, Info } from 'lucide-react';
import { LocationAutocomplete } from '../location-autocomplete';
import { VehicleCategory, RideType, calculateTransferPrice } from '@/lib/transfer-pricing';
import { DateTimePicker } from '@/components/date-time-picker';
import { TransferFormData } from '../transfer-wizard';

type ConfigStepProps = {
  data: TransferFormData;
  onUpdate: (data: Partial<TransferFormData>) => void;
  onNext: () => void;
};

export function ConfigStep({ data, onUpdate, onNext }: ConfigStepProps) {
  const [loading, setLoading] = useState<Record<number, boolean>>({});

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
  const totalWaitingHours = data.segments.reduce((acc, s, i) => {
    if (i === data.segments.length - 1) return acc;
    return acc + s.waitingTime;
  }, 0);

  const pricing = calculateTransferPrice(
    totalDistance,
    data.category,
    data.rideType,
    totalWaitingHours
  );

  const canContinue = data.segments.every(s => s.from && s.to && s.distanceKm > 0) && data.date;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-6 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configurează transferul</h2>
      </CardHeader>
      <CardContent className="px-0 space-y-8">

        {/* Vehicle Category Selection with Photos */}
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 block">Categorie vehicul</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onUpdate({ category: 'standard' })}
              suppressHydrationWarning
              className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                data.category === 'standard'
                  ? 'border-pink-500 shadow-lg shadow-pink-500/20 scale-[1.02]'
                  : 'border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700'
              }`}
            >
              <div className="relative h-32 sm:h-40 overflow-hidden bg-gray-100 dark:bg-black">
                <img 
                  src="/eclass.jpg" 
                  alt="Standard - Mercedes E-Class" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                {data.category === 'standard' && (
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent" />
                )}
              </div>
              <div className={`px-4 py-3 text-center font-semibold transition-colors ${
                data.category === 'standard'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white dark:bg-black text-gray-700 dark:text-gray-300'
              }`}>
                Standard
                <span className="block text-xs font-normal opacity-80 mt-0.5">1–3 pasageri</span>
              </div>
            </button>

            <button
              onClick={() => onUpdate({ category: 'van' })}
              suppressHydrationWarning
              className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                data.category === 'van'
                  ? 'border-pink-500 shadow-lg shadow-pink-500/20 scale-[1.02]'
                  : 'border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700'
              }`}
            >
              <div className="relative h-32 sm:h-40 overflow-hidden bg-gray-100 dark:bg-black">
                <img 
                  src="/van.jpg" 
                  alt="VAN - Mercedes V-Class" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                {data.category === 'van' && (
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent" />
                )}
              </div>
              <div className={`px-4 py-3 text-center font-semibold transition-colors ${
                data.category === 'van'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white dark:bg-black text-gray-700 dark:text-gray-300'
              }`}>
                VAN
                <span className="block text-xs font-normal opacity-80 mt-0.5">4–8 pasageri</span>
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
                : 'bg-gray-100 dark:bg-black text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-900'
            }`}
           >
             Un sens
           </button>
           <button 
            onClick={() => onUpdate({ rideType: 'round-trip' })}
            suppressHydrationWarning
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
              data.rideType === 'round-trip'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                : 'bg-gray-100 dark:bg-black text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-900'
            }`}
           >
             Dus-întors
           </button>
        </div>

        {/* Segments */}
        <div className="space-y-5">
          {data.segments.map((segment, index) => (
            <div key={index} className="relative pl-8 space-y-3">
              {/* Vertical line indicator */}
              <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-gradient-to-b from-pink-400 to-pink-200 dark:from-pink-500 dark:to-pink-800">
                <div className="absolute top-0 left-1/2 -ml-1.5 w-3 h-3 rounded-full border-2 border-pink-500 bg-white dark:bg-gray-900 shadow-sm" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5" />
                  Segment {index + 1}
                </span>
                {data.segments.length > 1 && (
                  <button onClick={() => removeSegment(index)} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 p-5 bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <LocationAutocomplete
                  value={segment.from}
                  onChange={(val) => updateSegment(index, 'from', val)}
                  label="PORNIRE"
                  placeholder="Introduceți adresa de pornire"
                />
                <LocationAutocomplete
                  value={segment.to}
                  onChange={(val) => updateSegment(index, 'to', val)}
                  label="DESTINAȚIE"
                  placeholder="Introduceți adresa de destinație"
                />
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-4">
                    {loading[index] ? (
                      <span className="text-sm text-pink-400 animate-pulse flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        Se calculează distanța...
                      </span>
                    ) : segment.distanceKm > 0 ? (
                      <div className="flex items-baseline gap-2">
                         <span className="px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full text-sm font-bold">
                           {segment.distanceKm} km
                         </span>
                         <span className="text-sm text-gray-500">{segment.durationText}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Waiting time - except for the last segment */}
                {index < data.segments.length - 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Staționare la destinație</span>
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

          {/* Note about pricing calculation */}
          <div className="flex items-start gap-2.5 px-4 py-3 bg-pink-50/70 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-800/30 rounded-xl">
            <Info className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" />
            <p className="text-xs text-pink-700 dark:text-pink-300 leading-relaxed">
              Prețul este calculat pe baza <strong>distanței totale</strong> a tuturor segmentelor, nu per segment individual.
            </p>
          </div>

          <Button 
            variant="outline" 
            onClick={addSegment} 
            suppressHydrationWarning
            className="w-full py-6 border-dashed border-2 rounded-2xl text-gray-400 hover:text-pink-500 hover:border-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-900/10 transition-all font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" /> Adaugă destinație
          </Button>
        </div>

        {/* Date, Time, Passengers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <DateTimePicker
            id="transfer-pickup-datetime"
            label="DATA ȘI ORA CURSEI"
            dateState={data.date}
            setDateState={(d) => onUpdate({ date: d })}
            timeState={data.time}
            setTimeState={(t) => onUpdate({ time: t })}
            minDate={new Date()}
          />
          
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">NUMĂR PASAGERI (1–8)</Label>
            <div className="flex items-center p-2 bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-xl">
              <Users className="w-4 h-4 text-pink-400 mx-2" />
              <input 
                type="number" 
                min={1} 
                max={8} 
                value={data.passengers}
                onChange={(e) => onUpdate({ passengers: parseInt(e.target.value) || 1 })}
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Pricing Summary Box */}
        <div className="p-6 bg-gradient-to-br from-pink-50 to-white dark:bg-black rounded-3xl border border-pink-100 dark:border-zinc-800 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Distanță totală</span>
            <span className="font-bold text-gray-900 dark:text-white">{totalDistance} km</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Tarif/km ({data.category === 'standard' ? 'Standard' : 'VAN'})</span>
            <span className="font-bold text-gray-900 dark:text-white">{pricing.ratePerKm.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Cost transport</span>
            <span className="font-bold text-gray-900 dark:text-white">{pricing.transportCost.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Staționări</span>
            <span className="font-bold text-gray-900 dark:text-white">{pricing.waitingCost.toFixed(2)} €</span>
          </div>
          <div className="pt-4 border-t border-pink-200 dark:border-gray-700 flex justify-between items-end">
            <span className="text-lg font-bold text-gray-900 dark:text-white">Total estimat</span>
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
          Continuă cu datele personale
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
