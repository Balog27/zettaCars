'use client';

import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { Logo } from '@/components/ui/logo';
import dynamic from 'next/dynamic';
const PriceCalculator = dynamic(() => import('@/components/transfer/price-calculator'), { ssr: false });
const SpecialOrdersForm = dynamic(() => import('@/components/transfer/special-orders-form'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
});
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

        <main className="flex-grow">
          {/* Hero with background image */}
          <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('/luxuaryTransfers.png')`, backgroundPosition: 'center' }}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {t('title')}
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-6">
                {t('subtitle')}
              </p>
            </div>
          </section>

          {/* Price calculator below hero */}
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto -mt-8">
                <PriceCalculator />
              </div>
            </div>
          </section>

          {/* Special Orders Section */}
          <section className="py-12 bg-background dark:bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-center mb-2">
                    {t('specialOrders.sectionTitle') ?? 'Special Transfer Orders'}
                  </h2>
                  <p className="text-center text-muted-foreground">
                    {t('specialOrders.sectionDescription') ?? 'Have a unique transfer need? Contact us for custom requests and special arrangements.'}
                  </p>
                </div>
                <SpecialOrdersForm />
              </div>
            </div>
          </section>
        </main>

        <Footer logo={<Logo alt="Zetta Cars Logo" />} brandName="" />
      </div>
    </>
  );
}
