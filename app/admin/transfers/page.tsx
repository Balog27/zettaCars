"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminTransfersPage() {
  const pricing = useQuery(api.transfers.getTransferPricing);
  const update = useMutation(api.transfers.updateTransferPricing);

  // Fixed Prices (single values for in-city)
  const [fixedStandard, setFixedStandard] = useState<number>(0);
  const [fixedPremium, setFixedPremium] = useState<number>(0);
  const [fixedVan, setFixedVan] = useState<number>(0);

  // Per Km Prices (min-max intervals for distance-based)
  const [perKmStandardMin, setPerKmStandardMin] = useState<number>(2);
  const [perKmStandardMax, setPerKmStandardMax] = useState<number>(2);
  const [perKmPremiumMin, setPerKmPremiumMin] = useState<number>(3);
  const [perKmPremiumMax, setPerKmPremiumMax] = useState<number>(3);
  const [perKmVanMin, setPerKmVanMin] = useState<number>(3.5);
  const [perKmVanMax, setPerKmVanMax] = useState<number>(3.5);

  const [childSeatPrice, setChildSeatPrice] = useState<number>(0);

  useEffect(() => {
    if (pricing) {
      setFixedStandard(pricing.fixedPrices?.standard ?? 0);
      setFixedPremium(pricing.fixedPrices?.premium ?? 0);
      setFixedVan(pricing.fixedPrices?.van ?? 0);
      setPerKmStandardMin(pricing.pricePerKm?.standard?.min ?? 0);
      setPerKmStandardMax(pricing.pricePerKm?.standard?.max ?? 0);
      setPerKmPremiumMin(pricing.pricePerKm?.premium?.min ?? 0);
      setPerKmPremiumMax(pricing.pricePerKm?.premium?.max ?? 0);
      setPerKmVanMin(pricing.pricePerKm?.van?.min ?? 0);
      setPerKmVanMax(pricing.pricePerKm?.van?.max ?? 0);
      setChildSeatPrice(pricing.childSeatPrice ?? 0);
    }
  }, [pricing]);

  const onSave = async () => {
    await update({
      fixedPrices: { 
        standard: fixedStandard, 
        premium: fixedPremium, 
        van: fixedVan 
      },
      pricePerKm: { 
        standard: { min: perKmStandardMin, max: perKmStandardMax }, 
        premium: { min: perKmPremiumMin, max: perKmPremiumMax }, 
        van: { min: perKmVanMin, max: perKmVanMax } 
      },
      childSeatPrice,
    });
    alert('Saved');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Transfer Pricing (Admin)</h1>
      <div className="max-w-3xl">
        <Card>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Fixed Prices (EUR) - In-City Transfers</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium mb-2">Standard</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={fixedStandard} 
                      onChange={e => setFixedStandard(Number(e.target.value))} 
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Premium</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={fixedPremium} 
                      onChange={e => setFixedPremium(Number(e.target.value))} 
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Van</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={fixedVan} 
                      onChange={e => setFixedVan(Number(e.target.value))} 
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Price Per KM (EUR) - Distance-Based Transfers</h3>
                <p className="text-sm text-gray-600 mb-4">Set min and max price per kilometer</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium mb-2">Standard</label>
                    <div className="space-y-2">
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="Min" 
                        value={perKmStandardMin} 
                        onChange={e => setPerKmStandardMin(Number(e.target.value))} 
                        className="w-full border rounded px-2 py-1"
                      />
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="Max" 
                        value={perKmStandardMax} 
                        onChange={e => setPerKmStandardMax(Number(e.target.value))} 
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Premium</label>
                    <div className="space-y-2">
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="Min" 
                        value={perKmPremiumMin} 
                        onChange={e => setPerKmPremiumMin(Number(e.target.value))} 
                        className="w-full border rounded px-2 py-1"
                      />
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="Max" 
                        value={perKmPremiumMax} 
                        onChange={e => setPerKmPremiumMax(Number(e.target.value))} 
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Van</label>
                    <div className="space-y-2">
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="Min" 
                        value={perKmVanMin} 
                        onChange={e => setPerKmVanMin(Number(e.target.value))} 
                        className="w-full border rounded px-2 py-1"
                      />
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="Max" 
                        value={perKmVanMax} 
                        onChange={e => setPerKmVanMax(Number(e.target.value))} 
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium">Child Seat Price (EUR/day)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={childSeatPrice} 
                  onChange={e => setChildSeatPrice(Number(e.target.value))}
                  className="w-full border rounded px-2 py-1 mt-1"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={onSave}>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
 