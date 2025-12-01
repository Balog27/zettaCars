"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useTransferPrice } from '@/hooks/useTransferPricing';

type Category = 'standard' | 'premium' | 'van';

export default function PriceCalculator() {
  const router = useRouter();
  const params = useParams();
  const locale = (params && (params as any).locale) || '';

  const pricing = useQuery(api.transfers.getTransferPricing);
  const { calculate, loading, error } = useTransferPrice();
  const [apiResult, setApiResult] = useState<any>(null);

  // Helper: Base64-encode a Unicode string safely in browsers
  // Source: MDN - btoa unicode workaround
  function base64EncodeUnicode(str: string) {
    try {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
      }));
    } catch (e) {
      // Fallback: try Buffer (Node/browserify) or return empty
      try {
        // @ts-ignore
        if (typeof Buffer !== 'undefined') return Buffer.from(str, 'utf-8').toString('base64');
      } catch (_e) {}
      console.error('base64EncodeUnicode error', e);
      return '';
    }
  }
  

  const [transferDate, setTransferDate] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('12:00');
  const [dropoffTime, setDropoffTime] = useState<string>('13:00');
  const [pickupLocation, setPickupLocation] = useState<string>('Cluj-Napoca Airport');
  const [dropoffLocation, setDropoffLocation] = useState<string>('City Center');
  const [persons, setPersons] = useState<number>(1);
  const [category, setCategory] = useState<Category>('standard');

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Ensure pricing exists
    if (!pricing) {
      alert('Pricing not available yet');
      return;
    }

    const payload = {
      pickup: { address: pickupLocation },
      dropoff: { address: dropoffLocation },
      category,
      pricing,
      meta: { transferDate, pickupTime, dropoffTime, persons }
    };

    const result = await calculate(payload);
    setApiResult(result);
    if (result && result.totalPrice != null) {
      // Prepare data to pass to summary
      const toPass = {
        pickupLocation,
        dropoffLocation,
        transferDate,
        pickupTime,
        dropoffTime,
        persons,
        category,
        pricing,
        calculated: result,
      };

      const encoded = encodeURIComponent(base64EncodeUnicode(JSON.stringify(toPass)));
      // Navigate to summary within locale
      const base = locale ? `/${locale}/transfers/summary` : `/transfers/summary`;
      router.push(`${base}?data=${encoded}`);
    } else {
      alert('Could not calculate price');
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden">
      <CardContent className="p-6 bg-gray-100">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Transfer Date</label>
              <input type="date" value={transferDate} onChange={e => setTransferDate(e.target.value)} className="w-full rounded-md border px-3 py-2 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Pickup Time</label>
              <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="w-full rounded-md border px-3 py-2 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Dropoff Time</label>
              <input type="time" value={dropoffTime} onChange={e => setDropoffTime(e.target.value)} className="w-full rounded-md border px-3 py-2 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Persons</label>
              <input type="number" min={1} value={persons} onChange={e => setPersons(Number(e.target.value))} className="w-full rounded-md border px-3 py-2 bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Pickup Location</label>
              <Input value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} className="bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Dropoff Location</label>
              <Input value={dropoffLocation} onChange={e => setDropoffLocation(e.target.value)} className="bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-3">Category</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setCategory('standard')}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-transform transform ${category === 'standard' ? 'border-pink-500 shadow-xl scale-105' : 'border-gray-200 bg-white'} flex flex-col items-center`}
              >
                <img src="/kuga.jpg" alt="Standard" className="w-full h-36 object-cover rounded-md mb-3" />
                <span className="font-semibold">Standard</span>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setCategory('premium')}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-transform transform ${category === 'premium' ? 'border-pink-500 shadow-xl scale-105' : 'border-gray-200 bg-white'} flex flex-col items-center`}
              >
                <img src="/eclass.jpg" alt="Premium" className="w-full h-36 object-cover rounded-md mb-3" />
                <span className="font-semibold">Premium</span>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setCategory('van')}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-transform transform ${category === 'van' ? 'border-pink-500 shadow-xl scale-105' : 'border-gray-200 bg-white'} flex flex-col items-center`}
              >
                <img src="/van.jpg" alt="Van" className="w-full h-36 object-cover rounded-md mb-3" />
                <span className="font-semibold">Van</span>
              </div>
            </div>
          </div>

          {pricing === null && (
            <p className="text-sm text-red-500">Pricing is not configured. Please contact admin or configure rates in the admin panel.</p>
          )}

          {error && (
            <div className="text-sm text-red-600 font-semibold">API error: {error}</div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading || !pricing} className="bg-pink-500 hover:bg-pink-600 text-white">
              {loading ? 'Calculating...' : 'Calculate Price'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
