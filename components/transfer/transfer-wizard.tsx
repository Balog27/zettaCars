"use client";

import React, { useState, useEffect } from 'react';
import { ConfigStep } from '@/components/transfer/steps/config-step';
import { ContactStep } from '@/components/transfer/steps/contact-step';
import { SummaryStep } from '@/components/transfer/steps/summary-step';
import { VehicleCategory, RideType } from '@/lib/transfer-pricing';

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
};

export function TransferWizard() {
  const [step, setStep] = useState(1);
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
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateFormData = (data: Partial<TransferFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {step === 1 && (
        <ConfigStep 
          data={formData} 
          onUpdate={updateFormData} 
          onNext={nextStep} 
        />
      )}
      {step === 2 && (
        <ContactStep 
          data={formData} 
          onUpdate={updateFormData} 
          onNext={nextStep} 
          onBack={prevStep} 
        />
      )}
      {step === 3 && (
        <SummaryStep 
          data={formData} 
          onBack={prevStep} 
        />
      )}
    </div>
  );
}
