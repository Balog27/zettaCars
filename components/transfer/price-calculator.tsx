"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { DateTimePicker } from '@/components/date-time-picker';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useTransferPrice } from '@/hooks/useTransferPricing';

type Category = 'standard' | 'van';

export default function PriceCalculator() {
  const router = useRouter();
  const params = useParams();
  const locale = (params && (params as any).locale) || '';
  const t = useTranslations('transfersPage');
  const localeHook = useLocale();

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
  

  const [transferDate, setTransferDate] = useState<Date | undefined>(undefined);
  const [pickupTime, setPickupTime] = useState<string>('12:00');
  // dropoffTime removed per design
  const [pickupLocation, setPickupLocation] = useState<string>('Cluj-Napoca Airport');
  const [dropoffLocation, setDropoffLocation] = useState<string>('Cluj Napoca City Center');
  const [persons, setPersons] = useState<number>(1);
  const [category, setCategory] = useState<Category>('standard');

  // Auto-recommend category based on number of persons
  useEffect(() => {
    if (persons <= 3) {
      setCategory('standard');
    } else {
      setCategory('van');
    }
  }, [persons]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      console.log('Form submitted - calculating price...');

      // Ensure pricing exists
      if (!pricing) {
        console.warn('Pricing not available');
        alert('Pricing not available yet');
        return;
      }

      console.log('Pricing available, creating payload...');
      const payload = {
        pickup: { address: pickupLocation },
        dropoff: { address: dropoffLocation },
        category,
        pricing,
        meta: { transferDate: transferDate ? transferDate.toISOString().split('T')[0] : '', pickupTime, persons }
      };
      console.log('Payload:', payload);

      const result = await calculate(payload);
      console.log('API Result:', result);
      setApiResult(result);
      
      // The API returns { calculated: { totalPrice (for fixed), priceMin/priceMax (for distance), distanceKm, durationText, pricingSource, ... } }
      if (result && result.calculated && (result.calculated.totalPrice != null || result.calculated.priceMin != null)) {
        console.log('Price calculated successfully, preparing to navigate...');
        // Prepare data to pass to summary
        const toPass = {
          pickupLocation,
          dropoffLocation,
          transferDate: transferDate ? transferDate.toISOString().split('T')[0] : '',
          pickupTime,
          persons,
          category,
          pricing,
          calculated: result.calculated,
        };

        const encoded = encodeURIComponent(base64EncodeUnicode(JSON.stringify(toPass)));
        // Navigate to summary within locale
        const base = locale ? `/${locale}/transfers/summary` : `/transfers/summary`;
        console.log('Navigating to:', `${base}?data=${encoded.substring(0, 50)}...`);
        router.push(`${base}?data=${encoded}`);
      } else {
        console.error('Could not calculate price - result:', result);
        alert('Could not calculate price');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      alert('An error occurred while calculating the price. Please try again.');
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden bg-card dark:bg-card-darker border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6 bg-card dark:bg-card-darker">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <DateTimePicker
                id="transfer-pickup-datetime"
                label={t('booking.transferDate')}
                dateState={transferDate}
                setDateState={setTransferDate}
                timeState={pickupTime}
                setTimeState={setPickupTime}
                minDate={new Date()}
              />
            </div>
            {/* dropoff time removed intentionally */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">{t('booking.persons')}</label>
              <input type="number" min={1} value={persons} onChange={e => setPersons(Number(e.target.value))} className="w-full rounded-md border px-3 py-2 bg-white dark:bg-input/30 dark:text-white dark:border-input" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{t('booking.recommended')}: <strong className="ml-1">{persons <= 3 ? t('booking.standard') : t('booking.van')}</strong></p>
              {persons > 8 && (() => {
                const prompt = t('booking.contactPrompt', { contactLink: t('booking.contactLink') });
                const parts = prompt.split(t('booking.contactLink'));
                const before = parts[0] || '';
                const after = parts[1] || '';
                return (
                  <p className="text-sm mt-2">{before}
                    <span onClick={() => {
                      const base = localeHook ? `/${localeHook}/contact` : `/contact`;
                      router.push(base);
                    }} className="text-pink-500 font-semibold cursor-pointer">{t('booking.contactLink')}</span>
                    {after}
                  </p>
                );
              })()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">{t('booking.pickupLocation')}</label>
              <Input value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} className="bg-white dark:bg-input/30 dark:text-white dark:border-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">{t('booking.dropoffLocation')}</label>
              <Input value={dropoffLocation} onChange={e => setDropoffLocation(e.target.value)} className="bg-white dark:bg-input/30 dark:text-white dark:border-input" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-3">{t('booking.category')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setCategory('standard')}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-transform transform ${category === 'standard' ? 'border-pink-500 shadow-xl scale-105 bg-white dark:bg-input/50' : 'border-gray-200 dark:border-input bg-white dark:bg-input/30'} flex flex-col items-center`}
              >
                <img src="/eclass.jpg" alt="Standard" className="w-full h-36 object-cover rounded-md mb-3" />
                <span className="font-semibold dark:text-white">{t('booking.standard')}</span>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setCategory('van')}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-transform transform ${category === 'van' ? 'border-pink-500 shadow-xl scale-105 bg-white dark:bg-input/50' : 'border-gray-200 dark:border-input bg-white dark:bg-input/30'} flex flex-col items-center`}
              >
                <img src="/van.jpg" alt="Van" className="w-full h-36 object-cover rounded-md mb-3" />
                <span className="font-semibold dark:text-white">{t('booking.van')}</span>
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
            <Button type="submit" disabled={loading || !pricing} className="!bg-pink-500 hover:!bg-pink-600 !text-white">
              {loading ? (t('booking.calculateButton')) : t('booking.calculateButton')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
