"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { TransferFormData } from '../transfer-wizard';
import { calculateTransferPrice } from '@/lib/transfer-pricing';
import { CheckCircle2, ArrowLeft, Mail, Phone, Calendar, Clock, MapPin, Loader2, Ticket, Trash2, Users, User } from 'lucide-react';
import { toast } from 'sonner';

type SummaryStepProps = {
  data: TransferFormData;
  onUpdate: (data: Partial<TransferFormData>) => void;
  onBack: () => void;
};

export function SummaryStep({ data, onUpdate, onBack }: SummaryStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  const createRequest = useMutation(api.transferRequests.createTransferRequest);
  const checkVoucher = useMutation(api.vouchers.checkVoucher);

  const totalDistance = data.segments.reduce((acc, s) => acc + s.distanceKm, 0);
  const totalWaitingHours = data.segments.reduce((acc, s, i) => {
    // For round-trips, include last segment (driver waits at destination before returning)
    if (data.rideType === 'one-way' && i === data.segments.length - 1) return acc;
    return acc + s.waitingTime;
  }, 0);

  const pricing = calculateTransferPrice(
    totalDistance,
    data.category,
    data.rideType,
    totalWaitingHours
  );

  // Apply voucher discount if present
  let finalTotal = pricing.total;
  let voucherDiscount = 0;
  if (data.appliedVoucher) {
    voucherDiscount = data.appliedVoucher.discountAmount;
    finalTotal = Math.max(0, finalTotal - voucherDiscount);
  }

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setIsApplyingVoucher(true);
    try {
      const result = await checkVoucher({
        code: voucherCode.trim().toUpperCase(),
        serviceType: "transfers",
        orderPrice: pricing.total
      });

      if (result.success && result.voucherId) {
        onUpdate({
          appliedVoucher: {
            id: result.voucherId,
            code: voucherCode.trim().toUpperCase(),
            discountAmount: result.discountAmount!,
            type: result.type!,
            value: result.value!
          }
        });
        toast.success("Voucher aplicat cu succes!");
        setVoucherCode("");
      } else {
        toast.error(result.message || "Voucher invalid");
      }
    } catch (err: any) {
      toast.error(err.message || "Eroare la aplicarea voucherului");
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const removeVoucher = () => {
    onUpdate({ appliedVoucher: null });
    toast.success("Voucher eliminat");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createRequest({
        rideType: data.rideType,
        segments: data.segments.map(s => ({
            from: s.from,
            to: s.to,
            distanceKm: s.distanceKm,
            durationText: s.durationText,
            waitingTime: s.waitingTime
        })),
        waitingTotalHours: totalWaitingHours,
        totalDistanceKm: totalDistance,
        passengers: data.passengers,
        category: data.category,
        customerInfo: {
          name: `${data.customerInfo.firstName} ${data.customerInfo.lastName}`,
          email: data.customerInfo.email,
          phone: data.customerInfo.phone,
          message: data.customerInfo.message,
        },
        estimatedPrice: finalTotal,
        currency: 'EUR',
        voucherId: data.appliedVoucher?.id,
        voucherCode: data.appliedVoucher?.code,
        discountAmount: data.appliedVoucher?.discountAmount,
        // Legacy fields for email consistency
        pickupLocation: data.segments[0]?.from,
        dropoffLocation: data.segments[data.segments.length - 1]?.to,
        transferDate: data.date?.toISOString().split('T')[0],
        transferTime: data.time,
        numberOfPassengers: data.passengers,
        distanceKm: totalDistance,
      });

      // Send email notification
      try {
        await fetch('/api/send/transfer-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalInfo: {
              name: `${data.customerInfo.firstName} ${data.customerInfo.lastName}`,
              email: data.customerInfo.email,
              phone: data.customerInfo.phone,
              message: data.customerInfo.message,
            },
            transferDetails: {
              pickupLocation: data.segments[0]?.from,
              dropoffLocation: data.segments[data.segments.length - 1]?.to,
              transferDate: data.date,
              pickupTime: data.time,
              category: data.category,
              persons: data.passengers,
              distance: totalDistance,
            },
            pricing: {
              isSingle: true, // Wizard uses calculated fixed total
              price: pricing.total,
              currency: 'EUR',
              discountAmount: voucherDiscount,
              voucherCode: data.appliedVoucher?.code,
            },
            locale: 'ro', // Wizard seems to be in Romanian currently
          }),
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('A apărut o eroare la trimiterea cererii. Vă rugăm să încercați din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-none shadow-none bg-transparent py-12 text-center">
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          </div>
          <h2 className="text-3xl font-black">Cerere trimisă cu succes!</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Vă mulțumim pentru încredere. Veți primi un email de confirmare automată, iar un consultant Zetta Cars vă va contacta în cel mai scurt timp pentru confirmarea finală.
          </p>
          <Button onClick={() => window.location.reload()} className="mt-8 px-8 py-6 rounded-2xl font-bold bg-black text-white hover:bg-gray-800 transition-all shadow-xl">
            Închide
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-4 mb-2">
          {!isSubmitting && (
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rezumat Rezervare</h2>
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-8">
        {/* Details Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
             <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Traseu și Vehicul</h3>
                <div className="p-5 bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium">Data și Ora</p>
                        <p className="font-bold">{data.date?.toLocaleDateString('ro-RO')} la {data.time}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-50 dark:bg-pink-900/20 rounded-xl flex items-center justify-center text-pink-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium">Pasageri & Clasă</p>
                        <p className="font-bold">{data.passengers} persoane - {data.category.toUpperCase()}</p>
                      </div>
                   </div>
                   <div className="pt-2 border-t border-gray-50 dark:border-gray-800 space-y-3">
                      <p className="text-xs text-gray-500 uppercase font-medium">Segmente Rutiere (Staționări incluse)</p>
                      {data.segments.map((s, i) => (
                        <div key={i} className="flex gap-2">
                          <div className="flex flex-col items-center pt-1 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {i < data.segments.length - 1 && <div className="w-0.5 flex-grow bg-gray-200 my-1" />}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-start">
                               <div>
                                 <p className="text-sm font-semibold">{s.from} → {s.to}</p>
                                 <p className="text-xs text-gray-500">{s.distanceKm} km {s.durationText ? `• ${s.durationText}` : ''}</p>
                               </div>
                               {s.waitingTime > 0 && (
                                 <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-100">
                                   Așteptare: {s.waitingTime}h
                                 </span>
                               )}
                             </div>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Client</h3>
                <div className="p-5 bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium">Nume Complet</p>
                        <p className="font-bold">{data.customerInfo.firstName} {data.customerInfo.lastName}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                        <p className="font-bold">{data.customerInfo.email}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium">Telefon</p>
                        <p className="font-bold">{data.customerInfo.phone}</p>
                      </div>
                   </div>
                   {data.customerInfo.message && (
                     <div className="pt-2 border-t border-gray-50 dark:border-gray-800">
                        <p className="text-xs text-gray-500 uppercase font-medium">Mențiuni</p>
                        <p className="text-sm italic text-gray-600 dark:text-gray-400">"{data.customerInfo.message}"</p>
                     </div>
                   )}
                </div>
             </div>

             {/* Voucher Section */}
             <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cod Voucher</h3>
                <div className="p-4 bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm">
                   {data.appliedVoucher ? (
                     <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                        <div className="flex items-center gap-3">
                           <Ticket className="w-5 h-5 text-green-600" />
                           <div>
                              <p className="text-sm font-bold text-green-800 dark:text-green-300">{data.appliedVoucher.code}</p>
                              <p className="text-xs text-green-600">Reducere aplicată: -{data.appliedVoucher.discountAmount} €</p>
                           </div>
                        </div>
                        <button onClick={removeVoucher} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                   ) : (
                     <div className="flex gap-2">
                        <Input 
                          placeholder="Introdu codul voucher"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value)}
                          className="rounded-xl border-gray-100"
                        />
                        <Button 
                          onClick={handleApplyVoucher}
                          disabled={isApplyingVoucher || !voucherCode}
                          variant="outline"
                          className="rounded-xl font-bold"
                        >
                          {isApplyingVoucher ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aplică"}
                        </Button>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>

        {/* Pricing Summary Box */}
        <div className="p-8 bg-black text-white dark:bg-black dark:text-white rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 dark:bg-black/5 rounded-full blur-2xl" />
          
          <div className="flex justify-between items-end border-b border-white/20 dark:border-black/10 pb-4">
             <div>
                <h4 className="text-lg font-bold">Total Final</h4>
                <p className="text-xs text-white/60 italic">Include TVA și taxe de drum</p>
             </div>
             <div className="text-right">
                {data.appliedVoucher && (
                  <p className="text-sm line-through text-white/50 mb-1">{Math.round(pricing.total)}€</p>
                )}
                <span className="text-5xl font-black">{Math.round(finalTotal)}</span>
                <span className="text-2xl font-bold ml-1">€</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm font-medium">
             <div className="flex flex-col">
                <span className="text-white/60 text-[10px] uppercase tracking-wider mb-1">Distanță</span>
                <span>{totalDistance} km</span>
             </div>
             <div className="flex flex-col">
                <span className="text-white/60 text-[10px] uppercase tracking-wider mb-1">Tip Cursă</span>
                <span>{data.rideType === 'one-way' ? 'Un sens' : 'Dus-întors'}</span>
             </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full py-8 text-xl font-black bg-white text-black hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-zinc-900 rounded-2xl transition-all h-auto"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                Se procesează...
              </div>
            ) : (
              'Trimite cererea'
            )}
          </Button>
          
          {error && (
            <p className="text-center text-red-400 text-sm font-bold">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

