"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { TestimonialsColumn, Testimonial } from "@/components/ui/testimonials-column";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export function TestimonialsAnimatedSection({ reviews, title, subtitle }: { reviews: any[], title: string, subtitle?: string }) {
  const locale = useLocale();
  // Mapping current backend reviews
  const backendReviews: Testimonial[] = reviews.map((r, i) => ({
    text: r.text,
    name: r.name,
    role: r.title || (locale === 'ro' ? "Client Zetta Cars" : "Zetta Cars Client"),
    image: "", // Don't add random pictures if they aren't in the DB
  }));

  // Generating more high-quality reviews as requested
  const generatedReviews: Testimonial[] = [
    {
      text: "The Mercedes E-Class was in pristine condition. Pickup and drop-off at Cluj Airport was incredibly smooth. Best rental in Romania!",
      name: "Andrei Munteanu",
      role: "Business Traveler",
      image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100&h=100&fit=crop&q=80",
    },
    {
      text: "I booked a transfer for my family. The van was very spacious and the driver was extremely polite and helpful with our bags.",
      name: "Maria Popescu",
      role: "Family Vacation",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&q=80",
    },
    {
      text: "Zetta Cars was a lifesaver for my last-minute trip. The online platform is so easy to use, and I had my car ready in minutes.",
      name: "Robert Dragan",
      role: "Digital Nomad",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80",
    },
    {
      text: "Flawless service. The car was spotless and smelled like new. Their attention to detail really sets them apart in Cluj-Napoca.",
      name: "Elena Stan",
      role: "Client fidel",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80",
    },
    {
      text: "Great prices and Zero hidden fees. Everything was clear from the start. I highly recommend Zetta Cars for anyone visiting Cluj.",
      name: "Mark Johnson",
      role: "Tourist",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80",
    },
    {
      text: "Profesionalism de la început până la sfârșit. Transferul la aeroport a fost punctual și foarte confortabil.",
      name: "Lucian Barbu",
      role: "Antreprenor local",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80",
    }
  ];

  // Combine both sources
  const allTestimonials = [...backendReviews, ...generatedReviews];

  // Distribute into 3 columns
  const firstColumn = allTestimonials.slice(0, Math.ceil(allTestimonials.length / 3));
  const secondColumn = allTestimonials.slice(Math.ceil(allTestimonials.length / 3), Math.ceil(allTestimonials.length * 2 / 3));
  const thirdColumn = allTestimonials.slice(Math.ceil(allTestimonials.length * 2 / 3));

  return (
    <section className="bg-section dark:bg-background py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[640px] mx-auto mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-xs font-semibold uppercase tracking-wider mb-6">
            Testimoniale
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white dark:text-foreground text-center mb-6">
            {title}
          </h2>
          {subtitle && (
            <p className="text-center text-white/70 dark:text-muted-foreground text-lg leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Animated Columns */}
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[800px] overflow-hidden p-4">
          <TestimonialsColumn testimonials={firstColumn} duration={25} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={18} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={35} />
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12 relative z-20">
          <Button 
            asChild
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Link 
              href={`/${locale}/review`}
              className="inline-flex items-center"
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              {locale === 'ro' ? 'Lasă un Review' : 'Leave a Review'}
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-pink-500/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500/5 blur-[150px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
    </section>
  );
}
