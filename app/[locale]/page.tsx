"use client";

import * as React from "react";

import Image from "next/image"; // Import Next.js Image component
import Link from "next/link"; // Import Next.js Link component
import { ArrowRight, Car, Award, Clock, Shield, Calendar, CarFront, CheckCircle, Quote } from "lucide-react";
import { FeaturesSectionWithHoverEffects } from "@/components/blocks/feature-section-with-hover-effects";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { Header } from "@/components/ui/header";
import { VehicleSearchFilterForm } from "@/components/vehicle/vehicle-search-filter-form"; // Import the new form
import { VehicleCard } from "@/components/vehicle/vehicle-card"; // Import the new VehicleCard
import { HomepageVehicleCard } from "@/components/vehicle/homepage-vehicle-card"; // Import the homepage-specific VehicleCard
import { FaqSection } from "@/components/blocks/faq"; // Re-added import for FaqSection
import { BackgroundImage } from "@/components/ui/BackgroundImage"; // Import the new BackgroundImage component
import { AnimatedGroup } from "@/components/ui/animated-group"; // Import AnimatedGroup
import { Slideshow } from "@/components/ui/slideshow"; // Import the new Slideshow component
import { Vehicle } from "@/types/vehicle"; // Import centralized Vehicle type
import { useHomepageFeaturedVehicles } from "@/hooks/useHomepageFeaturedVehicles";
import { sectionAnimationVariants } from "@/lib/animations";
import { useTranslations } from 'next-intl';
import { useVehicleSearch } from "@/hooks/useVehicleSearch";
import { SearchData } from "@/lib/searchStorage";

// Updated VehicleList to accept search dates and pass them to VehicleCard
function VehicleList({
  vehicles,
  isLoading,
  searchState,
}: {
  vehicles: Vehicle[] | null;
  isLoading: boolean;
  searchState: SearchData & { isHydrated: boolean };
}) {
  const t = useTranslations('common');
  
  if (isLoading) {
    return <p className="text-center text-muted-foreground">{t('loadingFeaturedCars')}</p>;
  }
  if (vehicles === null) {
    return <p className="text-center text-destructive">{t('couldNotLoadFeaturedCars')}</p>;
  }
  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    return <p className="text-center text-muted-foreground">{t('noFeaturedCarsAvailable')}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => {
        if (!vehicle || typeof vehicle._id !== 'string') {
          return null;
        }
        // Pass search state to homepage vehicle cards for dynamic pricing
        return (
          <HomepageVehicleCard 
            key={vehicle._id} 
            vehicle={vehicle}
            pickupDate={searchState.pickupDate}
            returnDate={searchState.returnDate}
            deliveryLocation={searchState.deliveryLocation}
            restitutionLocation={searchState.restitutionLocation}
            pickupTime={searchState.pickupTime}
            returnTime={searchState.returnTime}
          />
        );
      })}
    </div>
  );
}



export default function Home() {
  // const ensureUserMutation = useMutation(api.users.ensureUser);
  // // const convex = useConvex(); // convex client might not be needed if imperative queries for search are removed

  // React.useEffect(() => {
  //   ensureUserMutation({});
  // }, [ensureUserMutation]);

  const t = useTranslations('homepage');
  const tTestimonials = useTranslations('testimonials');
  const tFaq = useTranslations('faq');
  const { vehiclesToDisplay, currentTitle, isLoading } = useHomepageFeaturedVehicles();
  
  // Add vehicle search hook to get search state
  const { searchState, updateSearchField } = useVehicleSearch();

  // Create FAQ items array from translations
  const faqItems = [
    { question: tFaq('questions.0.question'), answer: tFaq('questions.0.answer') },
    { question: tFaq('questions.1.question'), answer: tFaq('questions.1.answer') },
    { question: tFaq('questions.2.question'), answer: tFaq('questions.2.answer') },
    { question: tFaq('questions.3.question'), answer: tFaq('questions.3.answer') },
    { question: tFaq('questions.4.question'), answer: tFaq('questions.4.answer') },
    { question: tFaq('questions.5.question'), answer: tFaq('questions.5.answer') },
    { question: tFaq('questions.6.question'), answer: tFaq('questions.6.answer') },
  ];



  const scrollToCalculator = () => {
    const calculatorElement = document.getElementById('price-calculator');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header logo={<Image src="/logo.png" alt="Zetta Cars Logo" width={150} height={50} />} />

      <main className="relative flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <AnimatedGroup variants={sectionAnimationVariants} threshold={0.2} triggerOnce={true}>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {t('hero.headline').split('Zetta Cars')[0]}
                <span className="text-primary">Zetta Cars</span>
                {t('hero.headline').split('Zetta Cars')[1]}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                {t('hero.subheadline')}
              </p>
              <Button 
                size="lg"
                asChild
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Link href="/cars">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </AnimatedGroup>
          </div>
        </section>

        {/* Price Calculator Section */}
        <section id="price-calculator" className="relative z-10 bg-background">
          {/* <BackgroundImage bottomGradient={true} /> */}
          <div className="flex flex-col gap-12 max-w-5xl mx-auto p-4 md:p-6 lg:p-8 w-full py-16">

            <AnimatedGroup variants={sectionAnimationVariants} threshold={0.2} triggerOnce={true}>
              <VehicleSearchFilterForm 
                searchState={searchState}
                updateSearchField={updateSearchField}
              />
            </AnimatedGroup>

            <AnimatedGroup variants={sectionAnimationVariants} threshold={0.2} triggerOnce={true}>
              <div className="my-8">
                <h3 className="text-3xl font-semibold mb-6 text-center">
                  {currentTitle}
                </h3>
                <VehicleList
                  vehicles={vehiclesToDisplay}
                  isLoading={isLoading}
                  searchState={searchState}
                />
                <div className="flex justify-center mt-12">
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={() => window.location.href = '/cars'}
                  >
                    {t('viewAllCars')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        {/* Luxury Transfer Section */}
        <AnimatedGroup variants={sectionAnimationVariants} threshold={0.2} triggerOnce={true}>
          <section className="min-h-[calc(100vh-64px)] bg-slate-900 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[calc(100vh-64px)]">
              {/* Left Side - Image */}
              <div className="relative overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center bg-no-repeat min-h-[400px] md:min-h-full"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`
                  }}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Right Side - Content */}
              <div className="flex items-center justify-center p-8 md:p-12 lg:p-16">
                <div className="max-w-lg">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    {t('luxuryTransfer.headline')}
                  </h2>
                  
                  <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                    {t('luxuryTransfer.description')}
                  </p>

                  {/* Feature List */}
                  <ul className="space-y-4 mb-8">
                    {t.raw('luxuryTransfer.features').map((feature: string, index: number) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button 
                    size="lg"
                    asChild
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/transfers">
                      {t('luxuryTransfer.cta')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </AnimatedGroup>

        {/* Why Choose Section */}
        <AnimatedGroup variants={sectionAnimationVariants} threshold={0.2} triggerOnce={true}>
          <section className="min-h-[50vh] py-16 px-4 bg-background">
            <div className="container mx-auto">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                    {t('whyChoose.title')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Premium Fleet */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[240px] w-full">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                        <Award className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        {t('whyChoose.features.0.title')}
                      </h3>
                      <p className="text-gray-800 leading-relaxed">
                        {t('whyChoose.features.0.description')}
                      </p>
                    </div>
                  </div>

                  {/* Reliable Service */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[240px] w-full">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                        <Clock className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        {t('whyChoose.features.1.title')}
                      </h3>
                      <p className="text-gray-800 leading-relaxed">
                        {t('whyChoose.features.1.description')}
                      </p>
                    </div>
                  </div>

                  {/* Professional Care */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[240px] w-full">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                        <Shield className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        {t('whyChoose.features.2.title')}
                      </h3>
                      <p className="text-gray-800 leading-relaxed">
                        {t('whyChoose.features.2.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedGroup>

        {/* Booking Process Section */}
        <AnimatedGroup variants={sectionAnimationVariants} threshold={0.2} triggerOnce={true}>
          <section className="py-16 px-4 bg-gray-50">
            <div className="container mx-auto">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                    {t('bookingProcess.title')}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {t('bookingProcess.subtitle')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {/* Step 1: Choose Your Dates */}
                  <div className="text-center relative">
                    {/* Connection Line - Hidden on mobile, visible on desktop */}
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary -z-10" style={{ width: 'calc(100% + 2rem)' }}></div>
                    
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white relative z-10">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                        1
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {t('bookingProcess.steps.0.title')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('bookingProcess.steps.0.description')}
                    </p>
                  </div>

                  {/* Step 2: Select Your Vehicle */}
                  <div className="text-center relative">
                    {/* Connection Line */}
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-secondary -z-10" style={{ width: 'calc(100% + 2rem)' }}></div>
                    
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white relative z-10">
                        <CarFront className="w-8 h-8" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                        2
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {t('bookingProcess.steps.1.title')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('bookingProcess.steps.1.description')}
                    </p>
                  </div>

                  {/* Step 3: Confirm & Book */}
                  <div className="text-center relative">
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white relative z-10">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                        3
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {t('bookingProcess.steps.2.title')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('bookingProcess.steps.2.description')}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <Button 
                    size="lg"
                    asChild
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/cars">
                      {t('bookingProcess.cta')}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </AnimatedGroup>

        {/* Client Testimonials Section */}
        <AnimatedGroup variants={sectionAnimationVariants} threshold={0.2} triggerOnce={true}>
          <TestimonialCarousel 
            title={t('clientTestimonials.title')}
            reviews={t.raw('clientTestimonials.reviews')}
          />
        </AnimatedGroup>

        {/* FAQ Section */}
        <AnimatedGroup variants={sectionAnimationVariants} threshold={0.15} triggerOnce={true}>
          <FaqSection
            title={t('faq.title')}
            description={t('faq.description')}
            items={faqItems}
          />
        </AnimatedGroup>
      </main>

      <Footer
  logo={<Image src="/logo.png" alt="Zetta Cars Logo" width={150} height={50} />}
        brandName=""
      />

    </div>
  );
}
