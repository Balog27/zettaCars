"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminTransfersPage() {
  const pricing = useQuery(api.transfers.getTransferPricing);
  const update = useMutation(api.transfers.updateTransferPricing);

  const [fixedStandard, setFixedStandard] = useState<number>(0);
  const [fixedPremium, setFixedPremium] = useState<number>(0);
  const [fixedVan, setFixedVan] = useState<number>(0);

  const [perKmStandard, setPerKmStandard] = useState<number>(2);
  const [perKmPremium, setPerKmPremium] = useState<number>(3);
  const [perKmVan, setPerKmVan] = useState<number>(3.5);

  const [childSeatPrice, setChildSeatPrice] = useState<number>(0);

  useEffect(() => {
    if (pricing) {
      setFixedStandard(pricing.fixedPrices?.standard ?? 0);
      setFixedPremium(pricing.fixedPrices?.premium ?? 0);
      setFixedVan(pricing.fixedPrices?.van ?? 0);
      setPerKmStandard(pricing.pricePerKm?.standard ?? 0);
      setPerKmPremium(pricing.pricePerKm?.premium ?? 0);
      setPerKmVan(pricing.pricePerKm?.van ?? 0);
      setChildSeatPrice(pricing.childSeatPrice ?? 0);
    }
  }, [pricing]);

  const onSave = async () => {
    await update({
      fixedPrices: { standard: fixedStandard, premium: fixedPremium, van: fixedVan },
      pricePerKm: { standard: perKmStandard, premium: perKmPremium, van: perKmVan },
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
            <div className="space-y-4">
              <div>
                <label className="block">Fixed - Standard</label>
                <input type="number" value={fixedStandard} onChange={e => setFixedStandard(Number(e.target.value))} />
              </div>
              <div>
                <label className="block">Fixed - Premium</label>
                <input type="number" value={fixedPremium} onChange={e => setFixedPremium(Number(e.target.value))} />
              </div>
              <div>
                <label className="block">Fixed - Van</label>
                <input type="number" value={fixedVan} onChange={e => setFixedVan(Number(e.target.value))} />
              </div>

              <div>
                <label className="block">Per Km - Standard</label>
                <input type="number" step="0.01" value={perKmStandard} onChange={e => setPerKmStandard(Number(e.target.value))} />
              </div>
              <div>
                <label className="block">Per Km - Premium</label>
                <input type="number" step="0.01" value={perKmPremium} onChange={e => setPerKmPremium(Number(e.target.value))} />
              </div>
              <div>
                <label className="block">Per Km - Van</label>
                <input type="number" step="0.01" value={perKmVan} onChange={e => setPerKmVan(Number(e.target.value))} />
              </div>

              <div>
                <label className="block">Child Seat Price</label>
                <input type="number" step="0.01" value={childSeatPrice} onChange={e => setChildSeatPrice(Number(e.target.value))} />
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
export default function TransfersPage() {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <h1 className="text-4xl font-bold text-muted-foreground">Coming Soon</h1>
    </div>
  )
} 