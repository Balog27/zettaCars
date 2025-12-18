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
import { Send } from "lucide-react";
import Link from "next/link";
import { SignInButton, useUser } from "@clerk/nextjs";
import { PersonalInfoCard } from "@/components/reservation/personal-info-card";
import { PaymentMethodCard } from "@/components/reservation/payment-method-card";

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
    return JSON.parse(atob(decodeURIComponent(data)));
  } catch {
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
  const payload = useMemo(() => safeDecode(dataParam), [dataParam]) as any;

  // Editable states
  const [pickupLocationState, setPickupLocationState] = useState<string>(
    payload?.pickupLocation || payload?.pickup?.address || "",
  );
  const [dropoffLocationState, setDropoffLocationState] = useState<string>(
    payload?.dropoffLocation || payload?.dropoff?.address || "",
  );
  const [transferDateState, setTransferDateState] = useState<Date | undefined>(
    () =>
      payload?.meta?.transferDate
        ? new Date(payload.meta.transferDate)
        : payload?.transferDate
          ? new Date(payload.transferDate)
          : undefined,
  );
  const [pickupTimeState, setPickupTimeState] = useState<string | null>(
    payload?.meta?.pickupTime || payload?.pickupTime || null,
  );

  // Distance / duration state (km, text) - declare early before handleRecalculate uses them
  const [distanceKmState, setDistanceKmState] = useState<number | null>(
    payload?.calculated?.distanceKm ?? null,
  );
  const [durationTextState, setDurationTextState] = useState<string | null>(
    payload?.calculated?.durationText ?? payload?.duration ?? null,
  );
  const [pricingSourceState, setPricingSourceState] = useState<string>(
    payload?.calculated?.pricingSource ?? "fixed",
  );

  const [childSeats1to4, setChildSeats1to4] = useState<number>(0);
  const [childSeats5to12, setChildSeats5to12] = useState<number>(0);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const handleRecalculate = async () => {
    if (!pickupLocationState || !dropoffLocationState || !transferDateState || !pickupTimeState) {
      alert("Please fill in all required fields");
      return;
    }

    setIsRecalculating(true);
    try {
      const res = await fetch("/api/transfer-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: { address: pickupLocationState },
          dropoff: { address: dropoffLocationState },
          category: payload?.category || "standard",
          pricing: payload?.pricing,
          meta: {
            transferDate: transferDateState.toISOString().split("T")[0],
            pickupTime: pickupTimeState,
            persons: payload?.persons || 1,
          },
        }),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("Recalculate result:", result);
        
        if (result.calculated) {
          // CRITICAL: Update state in the correct order
          // 1. First update the pricing source
          if (result.calculated.pricingSource != null) {
            setPricingSourceState(result.calculated.pricingSource);
          }
          
          // 2. Then update distance based on pricing source
          if (result.calculated.pricingSource === "fixed") {
            // For fixed pricing (in-city), distance is not applicable
            setDistanceKmState(null);
          } else if (result.calculated.pricingSource === "distance") {
            // For distance-based pricing, set the distance from API
            if (result.calculated.distanceKm != null) {
              setDistanceKmState(result.calculated.distanceKm);
            }
          }
          
          // 3. Update duration text
          if (result.calculated.durationText) {
            setDurationTextState(result.calculated.durationText);
          }
          
          // 4. Update payload for fallback references
          if (payload) {
            payload.calculated = result.calculated;
            payload.pickupLocation = pickupLocationState;
            payload.dropoffLocation = dropoffLocationState;
            payload.transferDate = transferDateState.toISOString().split("T")[0];
            payload.pickupTime = pickupTimeState;
          }
        }
      } else {
        console.error("API error response:", res.status, res.statusText);
        alert("Failed to recalculate price. Server error.");
      }
    } catch (error) {
      console.error("Error recalculating price:", error);
      alert("Failed to recalculate price. Please try again.");
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

  const [distanceLoading, setDistanceLoading] = useState(false);

  const user = useUser();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // If payload doesn't include calculated distance/duration, call server API to fetch it
  useEffect(() => {
    async function fetchDistance() {
      // Only fetch if we have addresses and haven't already fetched distance
      if (!payload?.pickup?.address || !payload?.dropoff?.address) return;
      
      // If pricingSource is fixed (both in Cluj), we don't need distance
      if (pricingSourceState === "fixed") return;
      
      // If we already have distance, don't fetch again
      if (distanceKmState != null) return;
      
      setDistanceLoading(true);
      try {
        const res = await fetch('/api/transfer-distance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin: payload.pickup.address, destination: payload.dropoff.address }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.distanceKm != null) setDistanceKmState(json.distanceKm);
          if (json.durationText) setDurationTextState(json.durationText);
        }
      } catch (e) {
        // ignore network errors for now
      } finally {
        setDistanceLoading(false);
      }
    }
    fetchDistance();
  }, [payload?.pickup?.address, payload?.dropoff?.address, pricingSourceState, distanceKmState]);

  const selectedCategory = payload?.category ?? null;

  // Get price - single for fixed, range for distance
  const priceData = React.useMemo(() => {
    if (!payload || !selectedCategory) return { isSingle: true, price: 0, min: 0, max: 0 };
    
    const pricing = payload.pricing || {};
    
    // Always use state values if available (they get updated on recalculate)
    const pricingSource = pricingSourceState ?? payload.calculated?.pricingSource ?? "fixed";
    const distanceKm = distanceKmState ?? payload.calculated?.distanceKm ?? null;
    
    // Calculate based on pricing source
    if (pricingSource === "fixed") {
      // Use fixed single price for in-city transfers
      const fixedPrice = pricing.fixedPrices?.[selectedCategory] ?? 0;
      return { isSingle: true, price: fixedPrice, min: 0, max: 0 };
    }
    
    if (pricingSource === "distance") {
      // Calculate range based on distance with min-max
      const perKmPrice = pricing.pricePerKm?.[selectedCategory];
      if (distanceKm != null && perKmPrice?.min && perKmPrice?.max) {
        const minPrice = Math.round(distanceKm * perKmPrice.min * 100) / 100;
        const maxPrice = Math.round(distanceKm * perKmPrice.max * 100) / 100;
        return { isSingle: false, price: 0, min: minPrice, max: maxPrice };
      }
    }
    
    // Fallback
    if (payload.calculated?.totalPrice != null) {
      return { isSingle: true, price: payload.calculated.totalPrice, min: 0, max: 0 };
    }
    if (payload.calculated?.priceMin != null || payload.calculated?.priceMax != null) {
      return { isSingle: false, price: 0, min: payload.calculated.priceMin ?? 0, max: payload.calculated.priceMax ?? 0 };
    }
    
    return { isSingle: true, price: 0, min: 0, max: 0 };
  }, [payload, selectedCategory, distanceKmState, pricingSourceState]);

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

  const childSeatPrice = payload.pricing?.childSeatPrice ?? 0;
  const addons = (childSeats1to4 + childSeats5to12) * childSeatPrice;
  const finalTotalMin = Math.round((priceData.min + addons) * 100) / 100;
  const finalTotalMax = Math.round((priceData.max + addons) * 100) / 100;
  const finalTotal = Math.round((priceData.price + addons) * 100) / 100;
 

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
                  {t("booking.transferDate") ?? "Rental Details"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium">
                      Pick-up Location
                    </Label>
                    <LocationAutocomplete
                      value={pickupLocationState}
                      onChange={(value) => {
                        setPickupLocationState(value);
                        setFormErrorsState((prev: any) => ({
                          ...prev,
                          locations: {
                            ...prev.locations,
                            pickup: undefined,
                          }
                        }));
                      }}
                      placeholder="Enter pickup location..."
                    />
                    {formErrorsState.locations?.pickup && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <span className="inline-block mr-1">⚠️</span>
                        {formErrorsState.locations.pickup}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Dropoff Location
                    </Label>
                    <LocationAutocomplete
                      value={dropoffLocationState}
                      onChange={(value) => {
                        setDropoffLocationState(value);
                        setFormErrorsState((prev: any) => ({
                          ...prev,
                          locations: {
                            ...prev.locations,
                            dropoff: undefined,
                          }
                        }));
                      }}
                      placeholder="Enter dropoff location..."
                    />
                    {formErrorsState.locations?.dropoff && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <span className="inline-block mr-1">⚠️</span>
                        {formErrorsState.locations.dropoff}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <DateTimePicker
                      id="ts-transfer-datetime"
                      label={t("booking.transferDate") ?? "Transfer Date"}
                      dateState={transferDateState}
                      setDateState={(date) => {
                        setTransferDateState(date);
                        setFormErrorsState((prev: any) => ({
                          ...prev,
                          datetime: {
                            ...prev.datetime,
                            transferDate: undefined,
                          }
                        }));
                      }}
                      timeState={pickupTimeState}
                      setTimeState={(time) => {
                        setPickupTimeState(time);
                        setFormErrorsState((prev: any) => ({
                          ...prev,
                          datetime: {
                            ...prev.datetime,
                            pickupTime: undefined,
                          }
                        }));
                      }}
                      minDate={new Date()}
                    />
                    {(formErrorsState.datetime?.transferDate || formErrorsState.datetime?.pickupTime) && (
                      <div className="mt-2 space-y-1">
                        {formErrorsState.datetime?.transferDate && (
                          <p className="text-sm text-red-500 flex items-center">
                            <span className="inline-block mr-1">⚠️</span>
                            {formErrorsState.datetime.transferDate}
                          </p>
                        )}
                        {formErrorsState.datetime?.pickupTime && (
                          <p className="text-sm text-red-500 flex items-center">
                            <span className="inline-block mr-1">⚠️</span>
                            {formErrorsState.datetime.pickupTime}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Button
                      onClick={handleRecalculate}
                      disabled={isRecalculating}
                      className="w-full !bg-pink-500 hover:!bg-pink-600 !text-white"
                    >
                      {isRecalculating ? "Recalculating..." : t("recalculateButton") ?? "Recalculate Price"}
                    </Button>
                  </div>
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
                          <div className="text-xs text-slate-500 mt-0.5">
                            3 EUR per seat per day (max 2 seats)
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
                          <div className="text-sm font-medium">
                            {childSeats1to4 > 0 ? `${childSeats1to4 * 3} EUR` : '0 EUR'}
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
                          <div className="text-xs text-slate-500 mt-0.5">
                            3 EUR per seat per day (max 2 seats)
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
                          <div className="text-sm font-medium">
                            {childSeats5to12 > 0 ? `${childSeats5to12 * 3} EUR` : '0 EUR'}
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
              <CardHeader><CardTitle>{t('summary.title') ?? 'Reservation Summary'}</CardTitle></CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                  <div>
                    <dt className="font-medium">{t('summary.pickup') ?? 'Pick-up:'}</dt>
                    <dd className="mt-1 text-slate-600 dark:text-slate-300">{pickupLocationState || payload.pickup?.address || '—'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{t('summary.dropoff') ?? 'Dropoff:'}</dt>
                    <dd className="mt-1 text-slate-600 dark:text-slate-300">{dropoffLocationState || payload.dropoff?.address || '—'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{t('summary.date') ?? 'Date:'}</dt>
                    <dd className="mt-1 text-slate-600 dark:text-slate-300">{transferDateState ? `${transferDateState.toLocaleDateString()} at ${pickupTimeState ?? payload.meta?.pickupTime ?? '—'}` : (payload.meta?.transferDate ?? '—')}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{t('summary.distance') ?? 'Distance:'}</dt>
                    <dd className="mt-1 text-slate-600 dark:text-slate-300">{distanceLoading ? 'Calculating…' : (distanceKmState != null ? `${distanceKmState} km` : (payload.calculated?.distanceKm != null ? `${payload.calculated.distanceKm} km` : '-'))}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{t('summary.numberOfPersons') ?? 'Number of Persons:'}</dt>
                    <dd className="mt-1 text-slate-600 dark:text-slate-300">{payload?.persons ?? '-'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{t('summary.category') ?? 'Category:'}</dt>
                    <dd className="mt-1 text-slate-600 dark:text-slate-300 capitalize">{payload?.category ?? '-'}</dd>
                  </div>
                </dl>

                <div className="mt-4">
                  <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">{t('summary.priceBreakdown') ?? 'Price breakdown'}</div>
                  <div className="flex items-center justify-between text-base font-semibold">
                    <div>{t('summary.basePrice') ?? 'Base price'}</div>
                    <div>
                      {priceData.isSingle 
                        ? formatCurrency(priceData.price, payload.pricing?.currency)
                        : `${formatCurrency(priceData.min, payload.pricing?.currency)} - ${formatCurrency(priceData.max, payload.pricing?.currency)}`
                      }
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 mt-2"><div>{t('summary.childSeats') ?? 'Child seats'}</div><div>{(childSeats1to4 + childSeats5to12) > 0 ? `${childSeats1to4 + childSeats5to12} × ${formatCurrency(childSeatPrice ?? 0, payload.pricing?.currency)}` : '-'}</div></div>
                  <div className="border-t mt-4 pt-4 flex items-center justify-between">
                    <div className="text-sm font-medium">{t('summary.total') ?? 'Total'}</div>
                    <div className="text-lg font-bold">
                      {priceData.isSingle 
                        ? formatCurrency(finalTotal, payload.pricing?.currency)
                        : `${formatCurrency(finalTotalMin, payload.pricing?.currency)} - ${formatCurrency(finalTotalMax, payload.pricing?.currency)}`
                      }
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
                  if (!pickupLocationState?.trim()) {
                    errors.locations.pickup = 'Pick-up location is required';
                  }
                  if (!dropoffLocationState?.trim()) {
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
                      pickupLocation: pickupLocationState,
                      dropoffLocation: dropoffLocationState,
                      transferDate: transferDateState,
                      pickupTime: pickupTimeState,
                      category: payload?.category,
                      persons: payload?.persons,
                      distance: distanceKmState,
                    },
                    pricing: {
                      ...priceData,
                      currency: payload?.pricing?.currency,
                    },
                  };
                  
                  // Send transfer request email
                  try {
                    const emailResponse = await fetch('/api/send/transfer-request', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        personalInfo: personalInfoState,
                        transferDetails: {
                          pickupLocation: pickupLocationState,
                          dropoffLocation: dropoffLocationState,
                          transferDate: transferDateState,
                          pickupTime: pickupTimeState,
                          category: payload?.category,
                          persons: payload?.persons,
                          distance: distanceKmState,
                        },
                        pricing: {
                          ...priceData,
                          currency: payload?.pricing?.currency,
                        },
                        locale: localePath || 'en',
                      }),
                    });

                    if (!emailResponse.ok) {
                      console.error('Failed to send transfer request email', await emailResponse.json());
                      // Don't prevent navigation even if email fails
                    }
                  } catch (emailError) {
                    console.error('Error sending transfer request email:', emailError);
                    // Don't prevent navigation even if email fails
                  }
                  
                  // Navigate to confirmation page with encoded data
                  const encoded = encodeURIComponent(Buffer.from(JSON.stringify(confirmationData)).toString('base64'));
                  router.push(`${localePath ? `/${localePath}` : ''}/transfers/confirmation?data=${encoded}`);
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                {t("sendButton") ?? "Send Transfer Request"}
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