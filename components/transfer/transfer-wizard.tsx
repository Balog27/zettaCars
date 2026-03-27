"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ConfigStep } from '@/components/transfer/steps/config-step';
import { VehicleCategory, RideType } from '@/lib/transfer-pricing';
import { Id } from '@/convex/_generated/dataModel';

export type TransferFormData = {
  rideType: RideType;
  category: VehicleCategory;
  segments: {
    from: string;
    to: string;
    distanceKm: number;
    durationText?: string;
    waitingTime: number; // in hours
  }[];
  date?: Date;
  time: string;
  passengers: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message?: string;
  };
  appliedVoucher?: {
    id: Id<"vouchers">;
    code: string;
    discountAmount: number;
    type: "percentage" | "fixed";
    value: number;
  } | null;
};

export function TransferWizard() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  
  const [formData, setFormData] = useState<TransferFormData>({
    rideType: 'one-way',
    category: 'standard',
    segments: [{ from: '', to: '', distanceKm: 0, waitingTime: 0 }],
    time: '12:00',
    passengers: 1,
    customerInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    },
    appliedVoucher: null,
  });

  const updateFormData = (data: Partial<TransferFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    // Encode data and redirect to summary page
    const dataString = JSON.stringify(formData);
    const encodedData = btoa(unescape(encodeURIComponent(dataString)));
    router.push(`/${locale}/transfers/summary?data=${encodedData}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ConfigStep 
        data={formData} 
        onUpdate={updateFormData} 
        onNext={handleNext} 
      />
    </div>
  );
}
