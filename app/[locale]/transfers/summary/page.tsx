"use client";
import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateTimePicker } from "@/components/date-time-picker";
import { LocationAutocomplete } from "@/components/transfer/location-autocomplete";
import { Logo } from "@/components/ui/logo";
import { Send, X, Trash2, Plus, ArrowRight, Calendar, Clock, Users, MapPin, CreditCard, Tag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { SignInButton, useUser } from "@clerk/nextjs";
import { PersonalInfoCard } from "@/components/reservation/personal-info-card";
import { PaymentMethodCard } from "@/components/reservation/payment-method-card";
import { TransferFormData } from "@/components/transfer/transfer-wizard";
import { calculateTransferPrice } from "@/lib/transfer-pricing";

const Header = dynamic(
  () => import("@/components/ui/header").then((m) => m.Header),
  { ssr: false },
);
const Footer = dynamic(
  () => import("@/components/ui/footer").then((m) => m.Footer),
  { ssr: false },
);

function safeDecode(data?: string) {
  if (!data) return null;
  try {
    const base64 = decodeURIComponent(data);
    return JSON.parse(decodeURIComponent(escape(atob(base64))));
  } catch (e) {
    console.error("Decode error:", e);
    return null;
  }
}

function TransferSummaryPageContent() {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const localePath = pathname ? pathname.split("/")[1] : undefined;
  const t = useTranslations("transfersPage");

  const dataParam = search?.get("data") || undefined;
  const payload = useMemo(() => {
    const decoded = safeDecode(dataParam);
    if (!decoded) return null;
    
    // Support both old payload and new TransferFormData
    if (decoded.segments) return decoded as TransferFormData;
    
    // Legacy mapping
    return {
      rideType: 'one-way',
      category: decoded.category || 'standard',
      segments: [{
        from: decoded.pickupLocation || decoded.pickup?.address || "",
        to: decoded.dropoffLocation || decoded.dropoff?.address || "",
        distanceKm: decoded.calculated?.distanceKm || 0,
        waitingTime: 0
      }],
      date: decoded.meta?.transferDate ? new Date(decoded.meta.transferDate) : (decoded.transferDate ? new Date(decoded.transferDate) : undefined),
      time: decoded.meta?.pickupTime || decoded.pickupTime || "12:00",
      passengers: decoded.persons || decoded.numberOfPassengers || 1,
      customerInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      }
    } as TransferFormData;
  }, [dataParam]);

  // Editable states
  const [segmentsState, setSegmentsState] = useState<TransferFormData['segments']>(
    payload?.segments || [{ from: '', to: '', distanceKm: 0, waitingTime: 0 }]
  );
  
  const [transferDateState, setTransferDateState] = useState<Date | undefined>(
    payload?.date ? new Date(payload.date) : undefined
  );
  const [pickupTimeState, setPickupTimeState] = useState<string>(
    payload?.time || "12:00"
  );
  
  const [passengersState, setPassengersState] = useState<number>(
    payload?.passengers || 1
  );

  const [rideTypeState, setRideTypeState] = useState<string>(
    payload?.rideType || 'one-way'
  );
  
  const [categoryState, setCategoryState] = useState<string>(
    payload?.category || 'standard'
  );

  const [childSeats1to4, setChildSeats1to4] = useState<number>(0);
  const [childSeats5to12, setChildSeats5to12] = useState<number>(0);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    id: any;
    code: string;
    discountAmount: number;
    type: "percentage" | "fixed";
    value: number;
  } | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  const handleRecalculate = async () => {
    const hasEmpty = segmentsState.some(s => !s.from || !s.to);
    if (hasEmpty || !transferDateState || !pickupTimeState) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsRecalculating(true);
    try {
      const newSegments = [...segmentsState];
      for (let i = 0; i < newSegments.length; i++) {
        const res = await fetch('/api/transfer-distance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin: newSegments[i].from, destination: newSegments[i].to }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.distanceKm != null) newSegments[i].distanceKm = json.distanceKm;
          if (json.durationText) newSegments[i].durationText = json.durationText;
        }
      }
      setSegmentsState(newSegments);
      toast.success("Prices and distances updated!");
    } catch (error) {
      console.error("Error recalculating price:", error);
      toast.error("Failed to recalculate distances.");
    } finally {
      setIsRecalculating(false);
    }
  };

  const [paymentMethod, setPaymentMethod] =
    useState<string>("cash_on_delivery");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  // Minimal personal info state to reuse existing PersonalInfoCard
  const [personalInfoState, setPersonalInfoState] = useState<any>({
    name: "",
    email: "",
    phone: "",
    message: "",
    flightNumber: "",
  });

  // Errors object shape matching PersonalInfoCard and PaymentMethodCard expectations
  const [formErrorsState, setFormErrorsState] = useState<any>({
    personalInfo: {},
    payment: {},
    locations: {},
    datetime: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUser();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // If payload doesn't include calculated distance/duration, call server API to fetch it
  const segments = segmentsState;
  const totalDistance = segments.reduce((acc, s) => acc + s.distanceKm, 0);
  const totalWaitingHours = segments.reduce((acc, s, i) => {
    if (rideTypeState === 'one-way' && i === segments.length - 1) return acc;
    return acc + s.waitingTime;
  }, 0);

  const priceData = useMemo(() => {
    const pricing = calculateTransferPrice(
      totalDistance,
      categoryState as any,
      rideTypeState as any,
      totalWaitingHours
    );
    return { isSingle: true, price: pricing.total, min: 0, max: 0 };
  }, [totalDistance, categoryState, rideTypeState, totalWaitingHours]);

  // Handle voucher
  const checkVoucher = useMutation(api.vouchers.checkVoucher);
  const createTransferRequest = useMutation(api.transferRequests.createTransferRequest);
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    
    // Use max of range or fixed price for validation
    const subtotal = priceData.isSingle ? (priceData.price + addons) : (priceData.max + addons);

    setIsApplyingVoucher(true);
    try {
      const result = await checkVoucher({
        code: voucherCode.trim().toUpperCase(),
        serviceType: "transfers",
        orderPrice: subtotal
      });

      if (result.success && result.voucherId) {
        setAppliedVoucher({
          id: result.voucherId,
          code: voucherCode.trim().toUpperCase(),
          discountAmount: result.discountAmount!,
          type: result.type!,
          value: result.value!
        });
        toast.success("Voucher applied successfully!");
      } else {
        toast.error(result.message || "Invalid voucher");
      }
    } catch (err: any) {
      toast.error(err.message || "Error applying voucher");
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
  };

  if (!payload) {
    return (
      <div className="container mx-auto py-16">
        Invalid or missing booking data.
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="relative flex flex-col min-h-screen">
        <Header logo={<Logo alt="Zetta Cars Logo" />} />
        <main className="flex-grow bg-background py-12">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto py-12 text-center text-slate-600">Loading transfer details…</div>
          </div>
        </main>
        <Footer logo={<Logo alt="Zetta Cars Logo" />} brandName="" />
      </div>
    );
  }

  const childSeatPrice = 0; // FREE for transfers as requested by user
  const addons = (childSeats1to4 + childSeats5to12) * childSeatPrice;
  const finalTotalMin = Math.round((priceData.min + addons) * 100) / 100;
  const finalTotalMax = Math.round((priceData.max + addons) * 100) / 100;
  const finalTotal = Math.round((priceData.price + addons) * 100) / 100;
  
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === 'percentage') {
       // Apply to total
       discountAmount = (finalTotal * appliedVoucher.value) / 100;
    } else {
       discountAmount = appliedVoucher.value;
    }
    discountAmount = Math.min(discountAmount, finalTotal);
    discountAmount = Math.round(discountAmount * 100) / 100;
  }
 

  function formatCurrency(value: number, currency?: string) {
    if (!currency) return `${value}`;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(value);
    } catch {
      return `${value} ${currency}`;
    }
  }

  return (
    <div
      className="relative flex flex-col min-h-screen"
      suppressHydrationWarning
    >
      <Header logo={<Logo alt="Zetta Cars Logo" />} />
      <main className="flex-grow bg-background py-12">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">
              {t("summary.title") ?? "Reservation Summary"}
            </h1>
            <div>
              <button
                aria-label="Back to Transfers"
                onClick={() =>
                  router.push(
                    localePath ? `/${localePath}/transfers` : `/transfers`,
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-card-darker text-slate-900 dark:text-slate-200 text-sm font-medium transition-colors hover:text-pink-500 hover:border-pink-500 dark:hover:text-pink-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Transfers
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-6">
            <Card className="rounded-lg bg-card dark:bg-card-darker border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>
                  {t("booking.transferDate") ?? "Traseu și Detalii"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {segmentsState.map((segment, index) => (
                  <div key={index} className="relative pl-6 space-y-4 pb-6 border-b border-gray-100 dark:border-zinc-800 last:border-0 last:pb-0">
                    <div className="absolute left-0 top-2 bottom-6 w-0.5 bg-pink-500/30">
                      <div className="absolute top-0 left-[-3px] w-2 h-2 rounded-full bg-pink-500" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-pink-500 uppercase tracking-wider">
                        Segment {index + 1}
                      </h4>
                      {segmentsState.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSegmentsState(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Elimina
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-gray-400">PORNIRE</Label>
                        <LocationAutocomplete
                          value={segment.from}
                          onChange={(val) => {
                             const newSegments = [...segmentsState];
                             newSegments[index].from = val;
                             setSegmentsState(newSegments);
                          }}
                          placeholder="Adresa pornire..."
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-400">DESTINAȚIE</Label>
                        <LocationAutocomplete
                          value={segment.to}
                          onChange={(val) => {
                             const newSegments = [...segmentsState];
                             newSegments[index].to = val;
                             setSegmentsState(newSegments);
                          }}
                          placeholder="Adresa destinație..."
                        />
                      </div>
                    </div>

                    {index < segmentsState.length - 1 && (
                      <div className="flex items-center gap-4 pt-2">
                         <span className="text-sm font-medium text-gray-500">Staționare la destinație:</span>
                         <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                 const newSegments = [...segmentsState];
                                 newSegments[index].waitingTime = Math.max(0, newSegments[index].waitingTime - 0.5);
                                 setSegmentsState(newSegments);
                              }}
                            >-</Button>
                            <span className="font-bold text-sm min-w-[30px] text-center">{segment.waitingTime}h</span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                 const newSegments = [...segmentsState];
                                 newSegments[index].waitingTime += 0.5;
                                 setSegmentsState(newSegments);
                              }}
                            >+</Button>
                         </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <DateTimePicker
                    id="ts-transfer-datetime"
                    label={t("booking.transferDate") ?? "Data și Ora"}
                    dateState={transferDateState}
                    setDateState={setTransferDateState}
                    timeState={pickupTimeState}
                    setTimeState={setPickupTimeState}
                    minDate={new Date()}
                  />
                  <div>
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">PASAGERI</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      max={8} 
                      value={passengersState}
                      onChange={(e) => setPassengersState(parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                   <Button
                    variant="outline"
                    onClick={() => setSegmentsState([...segmentsState, { from: segmentsState[segmentsState.length-1].to, to: '', distanceKm: 0, waitingTime: 0 }])}
                    className="flex-1 border-dashed"
                   >
                     <Plus className="w-4 h-4 mr-2" /> Adaugă destinație
                   </Button>
                   <Button
                    onClick={handleRecalculate}
                    disabled={isRecalculating}
                    className="flex-1 !bg-pink-500 hover:!bg-pink-600 !text-white"
                   >
                    {isRecalculating ? "Se calculează..." : "Recalculează preț"}
                   </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
                <Card className="rounded-lg bg-card dark:bg-card-darker border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>
                      {t("additionalFeatures.title") ?? "Additional Features"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-medium">
                            {t("additionalFeatures.age1to4") ?? "Child Seat (1-4 years)"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                             Gratuit (max 2 scaune)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              className="px-3 py-1 border rounded"
                              onClick={() =>
                                setChildSeats1to4(Math.max(0, childSeats1to4 - 1))
                              }
                            >
                              -
                            </button>
                            <div className="w-8 text-center">{childSeats1to4}</div>
                            <button
                              className="px-3 py-1 border rounded"
                              onClick={() => {
                                if (childSeats1to4 + childSeats5to12 < 2)
                                  setChildSeats1to4(childSeats1to4 + 1);
                              }}
                            >
                              +
                            </button>
                          </div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                             Gratuit
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-medium">
                            {t("additionalFeatures.age5to12") ?? "Child Seat (5-12 years)"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                             Gratuit (max 2 scaune)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              className="px-3 py-1 border rounded"
                              onClick={() =>
                                setChildSeats5to12(Math.max(0, childSeats5to12 - 1))
                              }
                            >
                              -
                            </button>
                            <div className="w-8 text-center">{childSeats5to12}</div>
                            <button
                              className="px-3 py-1 border rounded"
                              onClick={() => {
                                if (childSeats1to4 + childSeats5to12 < 2)
                                  setChildSeats5to12(childSeats5to12 + 1);
                              }}
                            >
                              +
                            </button>
                          </div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                             Gratuit
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <PaymentMethodCard
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                termsAccepted={termsAccepted}
                setTermsAccepted={setTermsAccepted}
                errors={formErrorsState}
                disabledOptions={["card_online"]}
              />
            </div>

            <div className="space-y-6">
              <PersonalInfoCard
                personalInfo={personalInfoState}
                setPersonalInfo={setPersonalInfoState}
                errors={formErrorsState}
              />
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-8">
            <Card className="rounded-lg bg-card dark:bg-card-darker border border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-50 dark:border-zinc-800 pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                   <div className="w-1.5 h-8 bg-pink-500 rounded-full" />
                   {t('summary.title') ?? 'Rezumat Rezervare'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="space-y-4">
                  {segmentsState.map((s, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-bold text-pink-500 uppercase text-[10px] tracking-[0.1em] mb-1">Segment {i+1}</div>
                      <div className="flex items-start gap-2">
                         <div className="text-slate-900 dark:text-slate-100 font-medium">{s.from}</div>
                         <ArrowRight className="w-3 h-3 mt-1 shrink-0 text-slate-400" />
                         <div className="text-slate-900 dark:text-slate-100 font-medium">{s.to}</div>
                      </div>
                      <div className="flex gap-3 mt-1 text-xs text-slate-500">
                         <span>{s.distanceKm} km</span>
                         {i < segmentsState.length - 1 && s.waitingTime > 0 && (
                           <span className="text-pink-600 font-medium">Staționare: {s.waitingTime}h</span>
                         )}
                      </div>
                    </div>
                  ))}
                </div>

                <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm border-t pt-4">
                  <div>
                    <dt className="font-medium">{t('summary.date') ?? 'Data:'}</dt>
                    <dd className="mt-1 text-slate-600 dark:text-slate-300">{transferDateState ? `${transferDateState.toLocaleDateString()} la ${pickupTimeState}` : '—'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{t('summary.numberOfPersons') ?? 'Nr. persoane:'}</dt>
                    <dd className="mt-1 text-slate-600 dark:text-slate-300">{passengersState}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{t('summary.category') ?? 'Categorie:'}</dt>
                    <dd className="mt-1 text-slate-600 dark:text-slate-300 capitalize">{categoryState}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Distanță totală:</dt>
                    <dd className="mt-1 text-slate-600 dark:text-slate-300">{totalDistance} km</dd>
                  </div>
                </dl>

                <div className="mt-4 border-t pt-4">
                  <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">{t('summary.priceBreakdown') ?? 'Defalcarea prețului'}</div>
                  <div className="flex items-center justify-between text-base font-semibold">
                    <div>{t('summary.basePrice') ?? 'Preț transport'}</div>
                    <div>
                      {formatCurrency(priceData.price, 'EUR')}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 mt-2">
                    <div>{t('summary.childSeats') ?? 'Scaune copii'}</div>
                    <div>{(childSeats1to4 + childSeats5to12) > 0 ? `${childSeats1to4 + childSeats5to12} × ${formatCurrency(childSeatPrice ?? 0, 'EUR')}` : '-'}</div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t space-y-3">
                   <div className="flex items-center justify-between mb-4">
                     <div className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('summary.voucherTitle') ?? "Voucher"}</div>
                   </div>
                   
                   {!appliedVoucher ? (
                     <div className="flex gap-2">
                       <div className="relative flex-grow">
                         <input
                           type="text"
                           value={voucherCode}
                           onChange={(e) => setVoucherCode(e.target.value)}
                           placeholder={t('summary.enterVoucherCode') ?? "Cod voucher"}
                           className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-sm"
                         />
                       </div>
                       <Button 
                         variant="default" 
                         onClick={handleApplyVoucher} 
                         disabled={isApplyingVoucher || !voucherCode.trim()}
                         className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-6"
                       >
                          {isApplyingVoucher ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (t('summary.applyVoucher') ?? "Aplică")}
                       </Button>
                     </div>
                   ) : (
                     <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-2xl">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs">%</div>
                         <div>
                           <div className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-tighter">Voucher Aplicat</div>
                           <div className="text-sm font-bold text-gray-900 dark:text-white">{appliedVoucher.code}</div>
                         </div>
                       </div>
                       <button onClick={() => setAppliedVoucher(null)} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-white dark:hover:bg-zinc-900 rounded-xl">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   )}

                   {appliedVoucher && (
                     <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-zinc-800 space-y-2">
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-500 dark:text-gray-400">{t('summary.discount') ?? "Reducere"}</span>
                         <span className="font-bold text-green-600">-{discountAmount.toFixed(2)} €</span>
                       </div>
                     </div>
                   )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm font-medium">{t('summary.total') ?? 'Total Estimativ'}</div>
                      <div className="text-lg font-bold text-pink-500">
                        {formatCurrency(Math.max(0, finalTotal - discountAmount), 'EUR')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!priceData.isSingle && (
              <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">{t('summary.pricingNote.title') ?? 'Pricing Note'}</p>
                <p>{t('summary.pricingNote.message') ?? 'The final price will be confirmed after we review and accept your order. You will be contacted on email with the exact amount.'}</p>
              </div>
            )}

            <div className="mt-4">
              <button
                type="button"
                onClick={async () => {
                  // Validation - build errors object with proper structure
                  const errors: any = {
                    personalInfo: {},
                    payment: {},
                    locations: {},
                    datetime: {},
                  };
                  
                  // Validate personal info
                  if (!personalInfoState.name?.trim()) {
                    errors.personalInfo.name = 'Name is required';
                  }
                  if (!personalInfoState.email?.trim()) {
                    errors.personalInfo.email = 'Email is required';
                  }
                  if (!personalInfoState.phone?.trim()) {
                    errors.personalInfo.phone = 'Phone is required';
                  }
                  
                  // Validate locations
                  if (!segmentsState[0]?.from?.trim()) {
                    errors.locations.pickup = 'Pick-up location is required';
                  }
                  if (!segmentsState[segmentsState.length - 1]?.to?.trim()) {
                    errors.locations.dropoff = 'Dropoff location is required';
                  }
                  
                  // Validate datetime
                  if (!transferDateState) {
                    errors.datetime.transferDate = 'Transfer date is required';
                  }
                  if (!pickupTimeState) {
                    errors.datetime.pickupTime = 'Pickup time is required';
                  }
                  
                  // Validate payment method and terms
                  if (!termsAccepted) {
                    errors.payment.termsAccepted = 'You must accept the terms and conditions';
                  }
                  
                  // Check if there are any errors
                  const hasErrors = Object.values(errors).some((errObj: any) => Object.keys(errObj).length > 0);
                  
                  if (hasErrors) {
                    setFormErrorsState(errors);
                    return;
                  }
                  
                  // Clear errors if validation passes
                  setFormErrorsState({
                    personalInfo: {},
                    payment: {},
                    locations: {},
                    datetime: {},
                  });
                  
                  // All validation passed - prepare confirmation data
                  const confirmationData = {
                    personalInfo: personalInfoState,
                    transferDetails: {
                      segments: segmentsState,
                      transferDate: transferDateState,
                      pickupTime: pickupTimeState,
                      category: categoryState,
                      persons: passengersState,
                      distance: totalDistance,
                      childSeats1to4,
                      childSeats5to12,
                    },
                    pricing: {
                      ...priceData,
                      finalTotal: Math.max(0, finalTotal - discountAmount),
                      currency: "EUR",
                      discountAmount: discountAmount,
                    },
                    voucher: appliedVoucher ? {
                      code: appliedVoucher.code,
                      discountAmount: discountAmount
                    } : undefined
                  };
                  
                  // Save to Convex
                  setIsSubmitting(true);
                  try {
                    await createTransferRequest({
                      rideType: rideTypeState as any,
                      segments: segmentsState,
                      waitingTotalHours: totalWaitingHours,
                      totalDistanceKm: totalDistance,
                      passengers: passengersState,
                      category: categoryState as any,
                      customerInfo: {
                        name: personalInfoState.name,
                        email: personalInfoState.email,
                        phone: personalInfoState.phone,
                        message: personalInfoState.message || undefined,
                        flightNumber: personalInfoState.flightNumber || undefined,
                      },
                      estimatedPrice: Math.max(0, finalTotal - discountAmount),
                      currency: "EUR",
                      voucherId: appliedVoucher?.id,
                      voucherCode: appliedVoucher?.code,
                      discountAmount: discountAmount > 0 ? discountAmount : undefined,
                      childSeats1to4,
                      childSeats5to12,
                      // Legacy fields for backward compat
                      transferDate: transferDateState!.toISOString().split('T')[0],
                      transferTime: pickupTimeState,
                      pickupLocation: segmentsState[0].from,
                      dropoffLocation: segmentsState[segmentsState.length-1].to,
                      numberOfPassengers: passengersState,
                      distanceKm: totalDistance,
                    });

                    toast.success("Cererea a fost trimisă cu succes!");
                    
                    // Send transfer request email (Best effort)
                    try {
                      await fetch('/api/send/transfer-request', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          personalInfo: personalInfoState,
                          transferDetails: {
                             ...confirmationData.transferDetails,
                             pickupLocation: segmentsState[0].from,
                             dropoffLocation: segmentsState[segmentsState.length-1].to,
                          },
                          pricing: {
                            ...confirmationData.pricing,
                            voucherCode: appliedVoucher?.code,
                          },
                          locale: localePath || 'en',
                        }),
                      });
                    } catch (e) { console.error(e); }

                    // Navigate to confirmation page
                    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(confirmationData)))));
                    router.push(`${localePath ? `/${localePath}` : ''}/transfers/confirmation?data=${encoded}`);
                  } catch (convexError) {
                    console.error('Error saving transfer request:', convexError);
                    toast.error("A apărut o eroare la salvarea cererii.");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20"
              >
                {isSubmitting ? (
                   <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : <Send className="h-4 w-4" />}
                {isSubmitting ? "Se trimite..." : (t("sendButton") ?? "Trimite Cerere Transfer")}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer logo={<Logo alt="Zetta Cars Logo" />} brandName="" />
    </div>
  );
}
export default function TransferSummaryPage() {
  return (
    <Suspense fallback={
      <div className="relative flex flex-col min-h-screen">
        <Header logo={<Logo alt="Zetta Cars Logo" />} />
        <main className="flex-grow bg-background py-12">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto py-12 text-center text-slate-600">Loading transfer details…</div>
          </div>
        </main>
        <Footer logo={<Logo alt="Zetta Cars Logo" />} brandName="" />
      </div>
    }>
      <TransferSummaryPageContent />
    </Suspense>
  );
}