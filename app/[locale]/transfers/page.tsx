'use client';

import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { Logo } from '@/components/ui/logo';
import { TransferWizard } from '@/components/transfer/transfer-wizard';
import SpecialOrdersForm from '@/components/transfer/special-orders-form';
import { useTranslations } from 'next-intl';


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
      "url": "https://zettacarrental.com",
      "logo": "https://zettacarrental.com/logo.png",
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
      "serviceUrl": "https://zettacarrental.com/transfers",
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
    "url": "https://zettacarrental.com/transfers"
  });

  const transferSchema = generateTransferServiceSchema();

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(transferSchema)
        }}
      />
      <Header logo={<Logo alt="Zetta Cars Logo" />} />

        <main className="flex-grow">
          {/* Hero with background image */}
          <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('/luxuaryTransfers.png')`, backgroundPosition: 'center' }}
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                {t('title')}
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-6 font-medium">
                {t('subtitle')}
              </p>
            </div>
          </section>

          {/* Transfer Wizard */}
          <section className="py-12 bg-[#faf9f6] dark:bg-background min-h-[50vh]">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto mt-4 sm:mt-8 relative z-20">
                <div className="bg-card dark:bg-card-darker rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-100 dark:border-zinc-800">
                  <TransferWizard />
                </div>
              </div>
            </div>
          </section>

          {/* Special Orders Section */}
          <section className="pb-24 bg-[#faf9f6] dark:bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
              <SpecialOrdersForm />
            </div>
          </section>
        </main>

      <Footer logo={<Logo alt="Zetta Cars Logo" />} brandName="" />
    </div>
  );
}
