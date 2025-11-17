'use client';

import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Logo } from '@/components/ui/logo';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { Phone, Mail, MapPin, MessageCircle, ExternalLink, Clock } from 'lucide-react';
import { contactAnimationVariants, sectionAnimationVariants } from '@/lib/animations';
import { useTranslations } from 'next-intl';
import Head from 'next/head';

const ContactPage = () => {
  const t = useTranslations('contactPage');

  const handleMapClick = () => {
    // Replace with your actual Google Maps coordinates
    const mapsUrl = "https://maps.app.goo.gl/GqUHujmeuz49U4U27";
    window.open(mapsUrl, '_blank');
  };

  const handleWhatsAppClick = () => {
    // Replace with actual WhatsApp number
    const whatsappUrl = "https://wa.me/40750250121?text=Hello!%20I'm%20interested%20in%20your%20rental%20services.";
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="relative flex flex-col min-h-screen" suppressHydrationWarning>
      <Head>
        <title>Contact Zetta Cars - Masini de Inchiriat Cluj-Napoca</title>
  <meta name="description" content="Contactează Zetta Cars pentru masini de inchiriat Cluj-Napoca. Telefon: +40750250121. Email: contact@zettacarrental.com. Servicii profesionale de închiriere auto în Cluj." />
        <meta name="keywords" content="contact zetta cars, masini de inchiriat cluj-napoca, telefon închiriere auto cluj, car rentals cluj contact" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "mainEntity": {
                "@type": "Organization",
                "name": "Zetta Cars",
                "telephone": "+40750250121",
                "email": "contact@zettacarrental.com",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Cluj \"Avram Iancu\" International Airport, Strada Traian Vuia 149-151",
                  "addressLocality": "Cluj-Napoca",
                  "postalCode": "400397",
                  "addressCountry": "RO"
                },
                "openingHours": [
                  "Mo-Su 00:00-23:59"
                ],
                "contactPoint": [
                  {
                    "@type": "ContactPoint",
                    "telephone": "+40750250121",
                    "contactType": "customer service",
                    "availableLanguage": ["Romanian", "English"],
                    "areaServed": "Cluj-Napoca"
                  },
                  {
                    "@type": "ContactPoint",
                    "email": "contact@zettacarrental.com",
                    "contactType": "customer service",
                    "availableLanguage": ["Romanian", "English"]
                  }
                ]
              }
            })
          }}
        />
      </Head>
      <Header logo={<Logo alt="Zetta Cars Logo" />} />

  <main className="flex-grow bg-white">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-hero-section">
          <div className="container mx-auto text-center">
            <AnimatedGroup variants={contactAnimationVariants} threshold={0.2} triggerOnce={true}>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {t('title')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('subtitle')}
              </p>
            </AnimatedGroup>
          </div>
        </section>

  {/* Contact Form Section */}
  <section className="py-16 px-4 bg-background">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <AnimatedGroup variants={contactAnimationVariants} threshold={0.2} triggerOnce={true}>
                <Card className="overflow-hidden shadow-xl bg-card">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Left Side - Contact Form */}
                    <div className="p-8 md:p-12 border-r border-border min-h-[520px]">
                      <form className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t('contactForm.yourName')}
                          </label>
                          <input
                            type="text"
                            placeholder={t('contactForm.enterYourName')}
                            className="w-full px-4 py-3 rounded-lg border border-primary bg-background text-foreground focus:ring-0 focus:border-primary focus:outline-none transition-all"
                            suppressHydrationWarning
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t('contactForm.message')}
                          </label>
                          <textarea
                            rows={6}
                            placeholder={t('contactForm.messagePlaceholder')}
                            className="w-full px-4 py-3 rounded-lg border border-primary bg-background text-foreground focus:ring-0 focus:border-primary focus:outline-none transition-all resize-none"
                            suppressHydrationWarning
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-semibold"
                          suppressHydrationWarning
                        >
                          {t('contactForm.sendMessage')}
                        </Button>
                      </form>
                      
                      {/* Contact Info Below Form */}
                      <div className="mt-8 pt-8 border-t border-border space-y-6">
                        {/* Business hours row */}
                        <div className="flex items-start space-x-6">
                          <div style={{width: 64, height: 64}} className="w-16 h-16 aspect-square bg-pink-50 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                            <Clock className="w-8 h-8 text-pink-500" />
                          </div>
                          <div>
                            <p className="text-base md:text-lg font-semibold text-foreground">{t('businessHours.title')}</p>
                            <p className="text-sm md:text-base text-muted-foreground">{t('businessHours.mondayToSunday')}: {t('businessHours.mondayToSundayTime')}</p>
                          </div>
                        </div>

                        {/* Address row */}
                        <div className="flex items-start space-x-6">
                          <div style={{width: 64, height: 64}} className="w-16 h-16 aspect-square bg-pink-50 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                            <MapPin className="w-8 h-8 text-pink-500" />
                          </div>
                          <div>
                            <p className="text-base md:text-lg font-semibold text-foreground">{t('contactForm.address')}</p>
                            <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">{t('contactForm.addressText')}</p>
                          </div>
                        </div>

                        {/* Pickup note row */}
                        <div className="flex items-start space-x-6">
                          <div style={{width: 64, height: 64}} className="w-16 h-16 aspect-square bg-pink-50 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                            <ExternalLink className="w-8 h-8 text-pink-500" />
                          </div>
                          <div>
                            <p className="text-base md:text-lg font-semibold text-foreground">{t('contactForm.pickupNoteTitle')}</p>
                            <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">{t('contactForm.pickupNote')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Location Map */}
                    <div className="relative min-h-[520px]">
                      <div className="h-full min-h-[520px] relative">
                        <Image
                          src="/maps.png"
                          alt="Zetta Cars Office Location Map"
                          fill
                          className="object-cover"
                          priority
                        />
                        {/* Office Pin Overlay */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="relative">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                              <MapPin className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </AnimatedGroup>
            </div>
          </div>
        </section>

  {/* Contact Information */}
  <section className="py-16 px-4 bg-background">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <AnimatedGroup variants={contactAnimationVariants} threshold={0.2} triggerOnce={true}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {t('letsConnect.title')}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {t('letsConnect.subtitle')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Phone Contact */}
                  <Card className="hover:shadow-lg transition-shadow duration-300 border-border/50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{t('contactMethods.phone.title')}</h3>
                      <p className="text-muted-foreground mb-4">{t('contactMethods.phone.description')}</p>
                      <Button variant="outline" className="w-full" suppressHydrationWarning>
                        <Phone className="w-4 h-4 mr-2" />
                        {t('contactMethods.phone.buttonText')}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* WhatsApp */}
                  <Card className="hover:shadow-lg transition-shadow duration-300 border-border/50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{t('contactMethods.whatsapp.title')}</h3>
                      <p className="text-muted-foreground mb-4">{t('contactMethods.whatsapp.description')}</p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleWhatsAppClick}
                        suppressHydrationWarning
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {t('contactMethods.whatsapp.buttonText')}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Email */}
                  <Card className="hover:shadow-lg transition-shadow duration-300 border-border/50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{t('contactMethods.email.title')}</h3>
                      <p className="text-muted-foreground mb-4">{t('contactMethods.email.description')}</p>
                      <Button variant="outline" className="w-full" suppressHydrationWarning>
                        <Mail className="w-4 h-4 mr-2" />
                        {t('contactMethods.email.buttonText')}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Social Media Cards */}
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-foreground mb-6 text-center">{t('followUs')}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* TikTok */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 border-border/50">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{t('socialMedia.tiktok.title')}</h3>
                        <p className="text-muted-foreground mb-4">{t('socialMedia.tiktok.description')}</p>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => window.open("https://www.tiktok.com/@zettacars.ro?_r=1&_t=ZN-914li9Q4jA3", "_blank")}
                          suppressHydrationWarning
                        >
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                          </svg>
                          {t('socialMedia.tiktok.buttonText')}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Instagram */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 border-border/50">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{t('socialMedia.instagram.title')}</h3>
                        <p className="text-muted-foreground mb-4">{t('socialMedia.instagram.description')}</p>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => window.open("https://www.instagram.com/zettacars.ro?igsh=MXRmbGIza3kyY3p6dw==", "_blank")}
                          suppressHydrationWarning
                        >
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          {t('socialMedia.instagram.buttonText')}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Facebook */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 border-border/50">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{t('socialMedia.facebook.title')}</h3>
                        <p className="text-muted-foreground mb-4">{t('socialMedia.facebook.description')}</p>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => window.open("https://www.facebook.com/share/1FxdHKPc5L/?mibextid=wwXIfr", "_blank")}
                          suppressHydrationWarning
                        >
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          {t('socialMedia.facebook.buttonText')}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>

      </main>

      <Footer
        logo={<Logo alt="Zetta Cars Logo" />}
        brandName=""
      />
    </div>
  );
};

export default ContactPage;