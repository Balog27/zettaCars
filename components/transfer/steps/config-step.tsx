"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Minus, Plus, Trash2, MapPin, Search, Calendar, Clock, Users } from 'lucide-react';
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
    // Last segment never has waiting time as per requirements
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
        {/* Vehicle Category Toggle */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl max-w-md mx-auto sm:mx-0">
          <button
            onClick={() => onUpdate({ category: 'standard' })}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              data.category === 'standard'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => onUpdate({ category: 'van' })}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              data.category === 'van'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            VAN
          </button>
        </div>

        {/* Ride Type Selection */}
        <div className="flex gap-4">
           <Button 
            variant={data.rideType === 'one-way' ? 'default' : 'outline'}
            onClick={() => onUpdate({ rideType: 'one-way' })}
            className="rounded-full"
           >
             Un sens
           </Button>
           <Button 
            variant={data.rideType === 'round-trip' ? 'default' : 'outline'}
            onClick={() => onUpdate({ rideType: 'round-trip' })}
            className="rounded-full"
           >
             Dus-întors
           </Button>
        </div>

        {/* Segments */}
        <div className="space-y-6">
          {data.segments.map((segment, index) => (
            <div key={index} className="relative pl-8 space-y-4">
              {/* Vertical line indicator */}
              <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700">
                <div className="absolute top-0 left-1/2 -ml-1 w-2 h-2 rounded-full border-2 border-blue-500 bg-white dark:bg-gray-900" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Segment {index + 1}</span>
                {data.segments.length > 1 && (
                  <button onClick={() => removeSegment(index)} className="text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
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
                      <span className="text-sm text-gray-400 animate-pulse">Se calculează distanța...</span>
                    ) : segment.distanceKm > 0 ? (
                      <div className="flex items-baseline gap-2">
                         <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-sm font-bold">
                           {segment.distanceKm} km
                         </span>
                         <span className="text-sm text-gray-500">{segment.durationText}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Waiting time - except for the last segment OR if round-trip (which implies a return, possibly needing waiting time at the destination) */}
                {/* Requirements: "Între segmente intermediare (nu și la ultimul)" */}
                {index < data.segments.length - 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Staționare la destinație</span>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => updateSegment(index, 'waitingTime', Math.max(0, segment.waitingTime - 0.5))}
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold min-w-[3rem] text-center">{segment.waitingTime}h</span>
                      <button 
                        onClick={() => updateSegment(index, 'waitingTime', segment.waitingTime + 0.5)}
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        <Plus className="w-4 h-4" />
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
            className="w-full py-6 border-dashed border-2 rounded-2xl text-gray-500 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50/50 transition-all font-semibold"
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
            <div className="flex items-center p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl">
              <Users className="w-4 h-4 text-gray-400 mx-2" />
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
        <div className="p-6 bg-[#f8f7f2] dark:bg-gray-900 rounded-3xl space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Distanță totală</span>
            <span className="font-bold">{totalDistance} km</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tarif/km ({data.category === 'standard' ? 'Standard' : 'VAN'})</span>
            <span className="font-bold">{pricing.ratePerKm.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Cost transport</span>
            <span className="font-bold">{pricing.transportCost.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Staționări</span>
            <span className="font-bold">{pricing.waitingCost.toFixed(2)} €</span>
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-end">
            <span className="text-lg font-bold">Total estimat</span>
            <div className="text-right">
              <span className="text-3xl font-black text-gray-900 dark:text-white">{Math.round(pricing.total)}</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white ml-1">€</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={onNext} 
          disabled={!canContinue}
          className="w-full py-8 text-lg font-bold bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded-2xl transition-all shadow-xl"
        >
          Continuă cu datele personale
        </Button>
      </CardContent>
    </Card>
  );
}
