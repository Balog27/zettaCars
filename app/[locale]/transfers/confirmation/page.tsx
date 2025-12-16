"use client";

import React, { useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

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
    return JSON.parse(Buffer.from(decodeURIComponent(data), 'base64').toString('utf-8'));
  } catch {
    return null;
  }
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

function TransferConfirmationPageContent() {
  const search = useSearchParams();
  const router = useRouter();
  const t = useTranslations("transfersPage");

  const dataParam = search?.get("data") || undefined;
  const confirmationData = useMemo(() => safeDecode(dataParam), [dataParam]) as any;

  const calculateFinalPrice = () => {
    if (!confirmationData?.pricing) return 0;
    const childSeatPrice = 3; // EUR per seat
    const childSeats = (confirmationData.transferDetails?.persons || 1) - 1;
    const addon = Math.max(0, childSeats) * childSeatPrice;
    
    if (confirmationData.pricing.isSingle) {
      return confirmationData.pricing.price + addon;
    } else {
      return {
        min: confirmationData.pricing.min + addon,
        max: confirmationData.pricing.max + addon,
      };
    }
  };

  const finalPrice = calculateFinalPrice();

  if (!confirmationData) {
    return (
      <div className="relative flex flex-col min-h-screen">
        <Header logo={<Logo alt="Zetta Cars Logo" />} />
        <main className="flex-grow bg-background py-12">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto py-12 text-center text-slate-600">
              Invalid confirmation data.
            </div>
          </div>
        </main>
        <Footer logo={<Logo alt="Zetta Cars Logo" />} brandName="" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen" suppressHydrationWarning>
      <Header logo={<Logo alt="Zetta Cars Logo" />} />
      <main className="flex-grow bg-background py-12">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <Card className="rounded-lg bg-card dark:bg-card-darker border border-gray-200 dark:border-gray-700">
              <CardContent className="pt-12">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <CardTitle className="text-3xl mb-2">
                    {t("confirmation.title") ?? "Transfer Request Submitted"}
                  </CardTitle>
                  <p className="text-muted-foreground text-lg">
                    {t("confirmation.subtitle") ?? "Thank you for your transfer request. We have received your booking details."}
                  </p>
                </div>

                <div className="space-y-6 mb-8 border-t border-b py-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      {t("confirmation.transferDetails") ?? "Transfer Details"}
                    </h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                      <div>
                        <dt className="font-medium">{t("summary.pickup") ?? "Pick-up:"}</dt>
                        <dd className="mt-1 text-slate-600 dark:text-slate-300">
                          {confirmationData.transferDetails?.pickupLocation}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">{t("summary.dropoff") ?? "Dropoff:"}</dt>
                        <dd className="mt-1 text-slate-600 dark:text-slate-300">
                          {confirmationData.transferDetails?.dropoffLocation}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">{t("summary.date") ?? "Date & Time:"}</dt>
                        <dd className="mt-1 text-slate-600 dark:text-slate-300">
                          {new Date(confirmationData.transferDetails?.transferDate).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })} at{" "}
                          {confirmationData.transferDetails?.pickupTime}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">{t("summary.category") ?? "Category:"}</dt>
                        <dd className="mt-1 text-slate-600 dark:text-slate-300 capitalize">
                          {confirmationData.transferDetails?.category}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      {t("confirmation.personalInfo") ?? "Personal Information"}
                    </h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                      <div>
                        <dt className="font-medium">{t("confirmation.name") ?? "Name:"}</dt>
                        <dd className="mt-1 text-slate-600 dark:text-slate-300">
                          {confirmationData.personalInfo?.name}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">{t("confirmation.email") ?? "Email:"}</dt>
                        <dd className="mt-1 text-slate-600 dark:text-slate-300">
                          {confirmationData.personalInfo?.email}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">{t("confirmation.phone") ?? "Phone:"}</dt>
                        <dd className="mt-1 text-slate-600 dark:text-slate-300">
                          {confirmationData.personalInfo?.phone}
                        </dd>
                      </div>
                      {confirmationData.personalInfo?.flightNumber && (
                        <div>
                          <dt className="font-medium">{t("confirmation.flightNumber") ?? "Flight Number:"}</dt>
                          <dd className="mt-1 text-slate-600 dark:text-slate-300">
                            {confirmationData.personalInfo?.flightNumber}
                          </dd>
                        </div>
                      )}
                      {confirmationData.personalInfo?.message && (
                        <div className="md:col-span-2">
                          <dt className="font-medium">{t("confirmation.message") ?? "Message:"}</dt>
                          <dd className="mt-1 text-slate-600 dark:text-slate-300">
                            {confirmationData.personalInfo?.message}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {!confirmationData.pricing?.isSingle && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        {t("summary.priceBreakdown") ?? "Price Estimate"}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>{t("summary.basePrice") ?? "Base price"}</span>
                          <span className="font-semibold">
                            {typeof finalPrice === 'number'
                              ? formatCurrency(confirmationData.pricing?.price || 0, confirmationData.pricing?.currency)
                              : `${formatCurrency(confirmationData.pricing?.min || 0, confirmationData.pricing?.currency)} - ${formatCurrency(confirmationData.pricing?.max || 0, confirmationData.pricing?.currency)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-8">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    {confirmationData.pricing?.isSingle ? (
                      "We will review your transfer request and contact you as soon as possible within 6 hours to confirm availability. A confirmation email has been sent to the address you provided."
                    ) : (
                      t("confirmation.nextSteps") ??
                      "We will review your transfer request and contact you as soon as possible within 6 hours to confirm availability and finalize the price. A confirmation email has been sent to the address you provided."
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/transfers" className="block">
                    <Button className="w-full !bg-pink-500 hover:!bg-pink-600 !text-white">
                      {t("confirmation.backButton") ?? "Back to Transfers"}
                    </Button>
                  </Link>
                  <Link href="/" className="block">
                    <Button variant="outline" className="w-full">
                      {t("confirmation.homeButton") ?? "Back to Home"}
                    </Button>
                  </Link>
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
export default function TransferConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="relative flex flex-col min-h-screen">
        <Header logo={<Logo alt="Zetta Cars Logo" />} />
        <main className="flex-grow bg-background py-12">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto py-12 text-center text-slate-600">Loading confirmation…</div>
          </div>
        </main>
        <Footer logo={<Logo alt="Zetta Cars Logo" />} brandName="" />
      </div>
    }>
      <TransferConfirmationPageContent />
    </Suspense>
  );
}