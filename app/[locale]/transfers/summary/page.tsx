"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
const Header = dynamic(() => import('@/components/ui/header').then((mod) => mod.Header), { ssr: false });
const Footer = dynamic(() => import('@/components/ui/footer').then((mod) => mod.Footer), { ssr: false });
import { Logo } from '@/components/ui/logo';

function safeDecode(data?: string) {
  if (!data) return null;
  try {
    return JSON.parse(atob(decodeURIComponent(data)));
  } catch (e) {
    return null;
  }
}

export default function TransferSummaryPage() {
  const search = useSearchParams();
  const dataParam = search?.get('data') || undefined;
  const payload = useMemo(() => safeDecode(dataParam), [dataParam]);

  const pathname = usePathname();
  const pathParts = pathname ? pathname.split('/') : [];
  const locale = pathParts && pathParts.length > 1 && pathParts[1].length === 2 ? pathParts[1] : '';

  const router = useRouter();

  const [childSeats, setChildSeats] = useState<number>(0);
  const selectedCategory = payload?.category ?? null;

  // Compute base price based on the originally selected category and pricing source
  const basePrice = React.useMemo(() => {
    if (!payload) return 0;
    const pricing = payload.pricing || {};
    const pricingSource = payload.calculated?.pricingSource || 'fixed';
    if (!selectedCategory) return payload.calculated?.totalPrice ?? 0;
    if (pricingSource === 'fixed') {
      return pricing.fixedPrices?.[selectedCategory] ?? 0;
    }
    const distanceKm = payload.calculated?.distanceKm ?? null;
    const perKm = pricing.pricePerKm?.[selectedCategory] ?? 0;
    if (distanceKm != null) {
      return Math.round(distanceKm * perKm * 100) / 100;
    }
    return payload.calculated?.totalPrice ?? 0;
  }, [payload, selectedCategory]);

  if (!payload) {
    return <div className="container mx-auto py-16">Invalid or missing booking data.</div>;
  }

  const childSeatPrice = payload.pricing?.childSeatPrice ?? 0;
  const addons = childSeats * childSeatPrice;
  const finalTotal = Math.round((basePrice + addons) * 100) / 100;

  

  return (
    <div className="relative flex flex-col min-h-screen" suppressHydrationWarning>
      <Header logo={<Logo alt="Zetta Cars Logo" />} />
      <main className="flex-grow bg-background py-12">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Reservation Summary</h1>
            <div>
              <Button suppressHydrationWarning variant="ghost" onClick={() => router.push(locale ? `/${locale}/transfers/book` : `/transfers/book`)}>Back to transfers</Button>
            </div>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent>
                <div className="space-y-4">
                  <p><strong>Pickup:</strong> {payload.pickupLocation}</p>
                  <p><strong>Dropoff:</strong> {payload.dropoffLocation}</p>
                  <p><strong>Date:</strong> {payload.transferDate}</p>
                  <p><strong>Pickup time:</strong> {payload.pickupTime}</p>
                  <p><strong>Dropoff time:</strong> {payload.dropoffTime}</p>
                  <div>
                    <p className="font-medium mb-2">Category</p>
                    <div className="flex items-center gap-4">
                      {selectedCategory === 'standard' && (
                        <div className="flex items-center gap-3">
                          <img src="/kuga.jpg" alt="Standard" className="w-32 h-20 object-cover rounded-md" />
                          <span className="font-medium">Standard</span>
                        </div>
                      )}
                      {selectedCategory === 'premium' && (
                        <div className="flex items-center gap-3">
                          <img src="/eclass.jpg" alt="Premium" className="w-32 h-20 object-cover rounded-md" />
                          <span className="font-medium">Premium</span>
                        </div>
                      )}
                      {selectedCategory === 'van' && (
                        <div className="flex items-center gap-3">
                          <img src="/van.jpg" alt="Van" className="w-32 h-20 object-cover rounded-md" />
                          <span className="font-medium">Van</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p><strong>Persons:</strong> {payload.persons}</p>
                  <hr />
                  <p><strong>Base price:</strong> {basePrice} {payload.pricing?.currency || 'RON'}</p>
                  <p><strong>Child seats ({childSeats}):</strong> {addons} {payload.pricing?.currency || 'RON'}</p>
                  <p className="text-lg font-semibold">Total: {finalTotal} {payload.pricing?.currency || 'RON'}</p>

                  <div className="mt-4">
                    <label className="block mb-2">Add Child Seats (per seat: {childSeatPrice} {payload.pricing?.currency || 'RON'})</label>
                    <input suppressHydrationWarning type="number" min={0} value={childSeats} onChange={e => setChildSeats(Number(e.target.value))} className="w-32" />
                  </div>

                  <div className="flex justify-end">
                    <Button suppressHydrationWarning>Proceed to Reservation</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer logo={<Logo alt="Zetta Cars Logo" />} brandName="" />
    </div>
  );
}
