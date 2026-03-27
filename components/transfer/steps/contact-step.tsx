"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TransferFormData } from '../transfer-wizard';
import { ArrowLeft } from 'lucide-react';

type ContactStepProps = {
  data: TransferFormData;
  onUpdate: (data: Partial<TransferFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function ContactStep({ data, onUpdate, onNext, onBack }: ContactStepProps) {
  const handleChange = (field: string, value: string) => {
    onUpdate({
      customerInfo: {
        ...data.customerInfo,
        [field]: value,
      },
    });
  };

  const isFormValid = 
    data.customerInfo.firstName && 
    data.customerInfo.lastName && 
    data.customerInfo.email && 
    data.customerInfo.phone;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Date de contact</h2>
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prenume</Label>
            <Input 
              id="firstName"
              placeholder="Ex: Ion" 
              value={data.customerInfo.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="rounded-xl border-gray-200 dark:border-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nume</Label>
            <Input 
              id="lastName"
              placeholder="Ex: Popescu" 
              value={data.customerInfo.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="rounded-xl border-gray-200 dark:border-zinc-800"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</Label>
          <Input 
            id="email"
            type="email"
            placeholder="Ex: ion.popescu@gmail.com" 
            value={data.customerInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="rounded-xl border-gray-200 dark:border-zinc-800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Telefon</Label>
          <Input 
            id="phone"
            type="tel"
            placeholder="Ex: +40 7xx xxx xxx" 
            value={data.customerInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="rounded-xl border-gray-200 dark:border-zinc-800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mențiuni / observații (opțional)</Label>
          <Textarea 
            id="message"
            placeholder="Ex: număr zbor, bagaje speciale, etc." 
            value={data.customerInfo.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className="rounded-xl border-gray-200 dark:border-zinc-800 min-h-[120px]"
          />
        </div>

        <Button 
          onClick={onNext} 
          disabled={!isFormValid}
          className="w-full py-8 text-lg font-bold bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded-2xl transition-all shadow-xl"
        >
          Rezumat și trimitere
        </Button>
      </CardContent>
    </Card>
  );
}
