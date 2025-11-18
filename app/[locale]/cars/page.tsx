"use client";

import { VehicleFilters } from "@/components/vehicle/vehicle-filters";
import { VehicleFiltersSkeleton } from "@/components/vehicle/vehicle-filters-skeleton";
// VehicleTypeNavigation is rendered inside the filters card; removed the duplicate rendering below.
import { ContactCtaBanner } from "@/components/contact-cta-banner";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Logo } from "@/components/ui/logo";
import { VehicleSearchForm } from "@/components/vehicle/vehicle-search-form";
import Link from 'next/link';
import { VehicleSearchFormSkeleton } from "@/components/vehicle/vehicle-search-form-skeleton";
import { VehicleListDisplay } from "@/components/vehicle/vehicle-list-display";
import { VehicleTypeNavigation } from "@/components/vehicle/vehicle-type-navigation";
import { BackgroundSlideshow } from "@/components/ui/background-slideshow";
import { useVehicleSearch } from "@/hooks/useVehicleSearch";
import { useVehicleList } from "@/hooks/useVehicleList";
import Head from "next/head";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export default function CarsPage() {
  // Use custom hooks for state management
  const { searchState, updateSearchField } = useVehicleSearch();
  const { allVehicles, displayedVehicles, isLoading, error, setDisplayedVehicles } = useVehicleList(searchState.isHydrated);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);
  const t = useTranslations();
  const vf = useTranslations('vehicleSearchForm');

  // When the top vehicle-type navigation changes, update displayed vehicles accordingly
  useEffect(() => {
    if (!allVehicles) return;

    if (!selectedVehicleType) {
      setDisplayedVehicles(allVehicles);
      return;
    }

    setDisplayedVehicles(allVehicles.filter((v) => v.type === selectedVehicleType));
  }, [selectedVehicleType, allVehicles, setDisplayedVehicles]);

  // Generate schema markup for vehicle listings
  const generateVehicleListSchema = () => {
    if (!displayedVehicles || displayedVehicles.length === 0) return null;

    const vehicleItems = displayedVehicles.slice(0, 20).map((vehicle, index) => ({
      "@type": "Vehicle",
      "@id": `https://rngo.com/cars/${vehicle._id}`,
      "name": `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
      "brand": {
        "@type": "Brand",
        "name": vehicle.make
      },
      "model": vehicle.model,
      "vehicleModelDate": vehicle.year?.toString(),
      "bodyType": vehicle.type,
      "numberOfSeats": vehicle.seats,
      "fuelType": vehicle.fuelType || "Petrol",
      "vehicleTransmission": vehicle.transmission || "Manual",
      "vehicleEngine": {
        "@type": "EngineSpecification",
        "fuelType": vehicle.fuelType || "Petrol",
        "engineDisplacement": vehicle.engineCapacity ? `${vehicle.engineCapacity}L` : "1.6L"
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "EUR",
        "price": vehicle.pricingTiers?.[0]?.pricePerDay || "25",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": vehicle.pricingTiers?.[0]?.pricePerDay || "25",
          "priceCurrency": "EUR",
          "unitText": "per day"
        },
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Zetta Cars",
          "url": "https://rngo.com"
        }
      },
      "url": `https://rngo.com/cars/${vehicle._id}`,
      "image": vehicle.images?.[0] ? `https://rngo.com${vehicle.images[0]}` : "https://rngo.com/logo.png"
    }));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Masini de Inchiriat Cluj-Napoca | Car Rentals",
      "description": "Flota completă de masini de inchiriat în Cluj-Napoca cu prețuri competitive. Vehicule moderne pentru toate nevoile tale.",
      "url": "https://rngo.com/cars",
      "numberOfItems": vehicleItems.length,
      "itemListElement": vehicleItems.map((vehicle, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": vehicle
      })),
      "provider": {
        "@type": "Organization",
        "name": "Zetta Cars",
        "url": "https://rngo.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Cluj \"Avram Iancu\" International Airport, Strada Traian Vuia 149-151",
          "addressLocality": "Cluj-Napoca",
          "postalCode": "400397",
          "addressCountry": "RO"
        },
        "telephone": "+40750250121"
      }
    };
  };

  const vehicleSchema = generateVehicleListSchema();

  // Background slideshow images
  const backgroundImages = [
    "/carBanner1.png",
    "/carBanner2.png",
    "/carBanner3.png"
  ];

  return (
    <>
      <Head>
        <title>Masini de Inchiriat Cluj-Napoca | Zetta Cars</title>
        <meta name="description" content="Găsește masini de inchiriat Cluj-Napoca cu Zetta Cars. Flotă largă de vehicule moderne, prețuri competitive, rezervare online rapidă. Car rentals Cluj-Napoca disponibile 24/7." />
        <meta name="keywords" content="masini de inchiriat cluj-napoca, car rentals cluj, închiriere auto cluj, rent car cluj-napoca, vehicule închiriere cluj" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://rngo.com/cars" />
        
        {vehicleSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(vehicleSchema)
            }}
          />
        )}
      </Head>

      <div className="relative flex flex-col min-h-screen">
        {/* Header */}
        <Header logo={<Logo alt="Zetta Cars Logo" />} />

        {/* Background Slideshow Hero Section */}
        <BackgroundSlideshow 
          images={backgroundImages}
          interval={7000}
          className="h-[60vh] min-h-[400px] w-full"
        >
        </BackgroundSlideshow>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-8 flex flex-col gap-8">
          <div className="max-w-7xl mx-auto w-full">
          {/* Search Form + Filters: when hydrated and vehicles loaded, render both stacked inside a single link wrapper; otherwise show skeletons individually. */}
          {(!searchState.isHydrated || isLoading || !allVehicles) ? (
            <>
              <VehicleSearchFormSkeleton />
              <VehicleFiltersSkeleton />
            </>
          ) : (
            <>
              {/* Centered title above both cards */}
              <div className="mb-6 text-center">
                {/* Use the same translation keys as the search form */}
                <h1 className="text-2xl font-semibold">{vf('title')}</h1>
                <p className="text-muted-foreground">{vf('subtitle')}</p>
              </div>

              <Link href="/cars" className="block no-underline" aria-label="Open car search results">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                  <div className="w-full">
                    <VehicleSearchForm
                      searchState={searchState}
                      updateSearchField={updateSearchField}
                      isLoading={isLoading}
                    />
                  </div>

                  <div className="w-full">
                    <VehicleFilters 
                      allVehicles={allVehicles} 
                      onFilterChange={setDisplayedVehicles} 
                    />
                  </div>
                </div>
              </Link>
            </>
          )}

          {/* Upper vehicle type navigation (restored). */}
          {(!searchState.isHydrated || isLoading) ? null : (
            <div className="mt-6">
              <VehicleTypeNavigation selectedType={selectedVehicleType} onTypeChange={setSelectedVehicleType} />
            </div>
          )}
          
          {/* Vehicle List Display - already has internal skeleton handling */}
          <VehicleListDisplay
            vehicles={displayedVehicles}
            isLoading={isLoading}
            isHydrated={searchState.isHydrated}
            error={error}
            searchState={searchState}
          />

          {/* Contact CTA Banner */}
          {searchState.isHydrated && !isLoading && (
            <div className="flex justify-center mt-20">
              <div className="max-w-4xl w-full">
                <ContactCtaBanner />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer 
        logo={<Logo alt="Zetta Cars Logo" />} 
        brandName=""
      />
    </div>
    </>
  );
}