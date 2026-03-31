"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdminTransferTable } from "@/components/admin/transfer-requests-table";
import { DollarSign, TrendingUp } from "lucide-react";

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
    alert('Salvat cu succes');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestiune Transferuri</h1>
        <p className="text-muted-foreground">Configurează prețurile și gestionează cererile clienților</p>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="requests">Cereri de Transfer</TabsTrigger>
          <TabsTrigger value="pricing">Configurare Prețuri</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <AdminTransferTable />
        </TabsContent>

        <TabsContent value="pricing">
          <div className="max-w-4xl space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-8">
                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                       <DollarSign className="h-5 w-5" />
                       Prețuri Fixe (EUR) - In-City
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Standard</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={fixedStandard} 
                          onChange={e => setFixedStandard(Number(e.target.value))} 
                          className="w-full border rounded-md px-3 py-2 bg-background border-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Premium</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={fixedPremium} 
                          onChange={e => setFixedPremium(Number(e.target.value))} 
                          className="w-full border rounded-md px-3 py-2 bg-background border-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Van</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={fixedVan} 
                          onChange={e => setFixedVan(Number(e.target.value))} 
                          className="w-full border rounded-md px-3 py-2 bg-background border-input"
                        />
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                       <TrendingUp className="h-5 w-5" />
                       Preț per KM (EUR) - Inter-City
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Setează prețul minim și maxim per kilometru</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Standard */}
                      <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-muted-foreground/10">
                        <label className="font-bold">Standard</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Min</span>
                            <input 
                              type="number" 
                              step="0.01"
                              placeholder="Min" 
                              value={perKmStandardMin} 
                              onChange={e => setPerKmStandardMin(Number(e.target.value))} 
                              className="w-full border rounded px-2 py-1 bg-background"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Max</span>
                            <input 
                              type="number" 
                              step="0.01"
                              placeholder="Max" 
                              value={perKmStandardMax} 
                              onChange={e => setPerKmStandardMax(Number(e.target.value))} 
                              className="w-full border rounded px-2 py-1 bg-background"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Premium */}
                      <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-muted-foreground/10">
                        <label className="font-bold">Premium</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Min</span>
                            <input 
                              type="number" 
                              step="0.01"
                              placeholder="Min" 
                              value={perKmPremiumMin} 
                              onChange={e => setPerKmPremiumMin(Number(e.target.value))} 
                              className="w-full border rounded px-2 py-1 bg-background"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Max</span>
                            <input 
                              type="number" 
                              step="0.01"
                              placeholder="Max" 
                              value={perKmPremiumMax} 
                              onChange={e => setPerKmPremiumMax(Number(e.target.value))} 
                              className="w-full border rounded px-2 py-1 bg-background"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Van */}
                      <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-muted-foreground/10">
                        <label className="font-bold">Van</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Min</span>
                            <input 
                              type="number" 
                              step="0.01"
                              placeholder="Min" 
                              value={perKmVanMin} 
                              onChange={e => setPerKmVanMin(Number(e.target.value))} 
                              className="w-full border rounded px-2 py-1 bg-background"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Max</span>
                            <input 
                              type="number" 
                              step="0.01"
                              placeholder="Max" 
                              value={perKmVanMax} 
                              onChange={e => setPerKmVanMax(Number(e.target.value))} 
                              className="w-full border rounded px-2 py-1 bg-background"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="font-medium">Preț Scaun Copil (EUR/zi)</label>
                        <p className="text-xs text-muted-foreground">Cost adițional per scaun de copil selectat</p>
                      </div>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={childSeatPrice} 
                        onChange={e => setChildSeatPrice(Number(e.target.value))}
                        className="w-32 border rounded-md px-3 py-2 bg-background"
                      />
                    </div>
                  </section>

                  <div className="flex justify-end pt-4">
                    <Button onClick={onSave} size="lg" className="w-full md:w-auto">Salvează Modificările</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
 
