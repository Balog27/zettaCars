'use client';

import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { Logo } from '@/components/ui/logo';
import dynamic from 'next/dynamic';
const PriceCalculator = dynamic(() => import('@/components/transfer/price-calculator'), { ssr: false });
import { useTranslations } from 'next-intl';
import Head from 'next/head';

export default function TransfersPage() {
  const t = useTranslations('transfersPage');

  // Generate schema markup for transfer services
  const generateTransferServiceSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Transfer Services Cluj-Napoca",
    "alternateName": "Servicii Transfer Cluj-Napoca",
    "description": "Servicii profesionale de transfer în Cluj-Napoca și împrejurimi cu Zetta Cars. Transfer aeroport Cluj, transport privat, curse personalizate.",
    "provider": {
      "@type": "Organization",
      "name": "Zetta Cars",
      "url": "https://rngo.com",
      "logo": "https://rngo.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+40750250121",
        "contactType": "customer service",
        "areaServed": "Cluj-Napoca",
        "availableLanguage": ["Romanian", "English"]
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Cluj \"Avram Iancu\" International Airport, Strada Traian Vuia 149-151",
        "addressLocality": "Cluj-Napoca",
        "postalCode": "400397",
        "addressCountry": "RO"
      }
    },
    "areaServed": {
      "@type": "State",
      "name": "Cluj County",
      "containedInPlace": {
        "@type": "Country",
        "name": "Romania"
      }
    },
    "serviceType": [
      "Airport Transfer",
      "Private Transport",
      "City Transfer",
      "Business Transport"
    ],
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://rngo.com/transfers",
      "serviceSmsNumber": "+40750250121",
      "servicePhone": "+40750250121"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Transfer Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Airport Transfer Cluj-Napoca",
            "description": "Transfer de la și către Aeroportul Internațional Avram Iancu Cluj-Napoca"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "City Transfer Cluj-Napoca",
            "description": "Transport în oraș și împrejurimile Cluj-Napoca"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Business Transfer",
            "description": "Transport corporativ și pentru evenimente de business"
          }
        }
      ]
    },
    "url": "https://rngo.com/transfers"
  });

  const transferSchema = generateTransferServiceSchema();

  return (
    <>
      <Head>
        <title>Transfer Services Cluj-Napoca | Zetta Cars</title>
        <meta name="description" content="Servicii transfer Cluj-Napoca cu Zetta Cars. Transfer aeroport Cluj, transport privat, curse personalizate." />
        <meta name="keywords" content="transfer cluj-napoca, transfer aeroport cluj, transport privat cluj, servicii transfer romania" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://rngo.com/transfers" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(transferSchema)
          }}
        />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Header logo={<Logo alt="Zetta Cars Logo" />} />

        <main className="flex-grow bg-white py-12">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">{t('title')}</h1>
            <p className="text-lg text-muted-foreground text-center mb-8">{t('subtitle')}</p>
            <div className="max-w-3xl mx-auto">
              <PriceCalculator />
            </div>
          </div>
        </main>

        <Footer logo={<Logo alt="Zetta Cars Logo" />} brandName="" />
      </div>
    </>
  );
}
