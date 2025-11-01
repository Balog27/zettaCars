"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function ContactCtaBanner() {
  const t = useTranslations('contactBanner');

  return (
    <div className="w-full bg-slate-100 border border-slate-200 rounded-lg p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-1">
            {t('title')}
          </h3>
        </div>
        
        <Button 
          variant="outline"
          size="lg"
          asChild
          className="bg-white border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 font-medium px-6 py-3 whitespace-nowrap"
        >
          <Link href="/contact">
            {t('buttonText')}
          </Link>
        </Button>
      </div>
    </div>
  );
}