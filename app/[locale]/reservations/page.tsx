"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from 'next-intl';
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/ui/logo";
import Image from "next/image";
import { VehicleReservations } from "@/components/reservations/vehicle-reservations";
import { TransferReservations } from "@/components/reservations/transfer-reservations";

export default function ReservationsPage() {
  const { user, isLoaded } = useUser();
  const t = useTranslations('reservations');

  if (!isLoaded) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header logo={<Logo alt="Zetta Cars Logo" />} />
        <main className="flex-grow">
          <div className="container mx-auto py-16">
            <Card className="bg-card dark:bg-card-darker border border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <p className="text-lg font-medium">{t('pleaseSignIn')}</p>
                  <div className="flex justify-center">
                    <Button onClick={() => window.location.href = '/login'}>
                      {t('signInButton')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer logo={<Logo alt="Zetta Cars Logo" />} brandName="" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header logo={<Logo alt="Zetta Cars Logo" />} />
      <main className="flex-grow bg-background">
        <div className="container mx-auto py-8 px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="vehicle" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-200 dark:bg-card-darker">
              <TabsTrigger value="vehicle" className="text-gray-900 dark:text-gray-100 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-400">{t('tabs.vehicle')}</TabsTrigger>
              <TabsTrigger value="transfer" className="text-gray-900 dark:text-gray-100 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-400">{t('tabs.transfer')}</TabsTrigger>
            </TabsList>

            <TabsContent value="vehicle" className="space-y-4">
              <VehicleReservations />
            </TabsContent>

            <TabsContent value="transfer" className="space-y-4">
              <TransferReservations />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer logo={<Logo alt="Zetta Cars Logo" />} brandName="" />
    </div>
  );
}
