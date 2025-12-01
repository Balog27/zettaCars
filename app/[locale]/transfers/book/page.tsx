"use client";

import React from 'react';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Logo } from '@/components/ui/logo';
import PriceCalculator from '@/components/transfer/price-calculator';
import Head from 'next/head';

const TransferBookingPage = () => {
  return (
    <div className="relative flex flex-col min-h-screen" suppressHydrationWarning>
      <Head>
        <title>Book Transfer - Zetta Cars</title>
        <meta name="description" content="Book airport and city transfers with Zetta Cars" />
      </Head>
      <Header logo={<Logo alt="Zetta Cars Logo" />} />

      <main className="flex-grow bg-white py-12">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Book a Transfer</h1>
          <div className="max-w-3xl mx-auto">
            <PriceCalculator />
          </div>
        </div>
      </main>

      <Footer logo={<Logo alt="Zetta Cars Logo" />} brandName="" />
    </div>
  );
};

export default TransferBookingPage;
