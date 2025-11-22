'use client';

import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { Logo } from "@/components/ui/logo";
import { useTranslations } from 'next-intl';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlogListClient } from "@/components/blog/blog-list-client";
import Head from 'next/head';

export default function BlogPage() {
  const t = useTranslations('blogPage');
  const blogs = useQuery(api.blogs.getAll);

  // Generate schema markup for blog services
  const generateBlogServiceSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Blog Zetta Cars Cluj-Napoca",
      "alternateName": "Blog Masini de Inchiriat Cluj",
      "description": "Blog oficial Zetta Cars cu sfaturi de călătorie, ghiduri pentru Cluj-Napoca, noutăți despre mașini de închiriat și articole despre turism în Transilvania. În curând disponibil!",
      "publisher": {
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
      "about": {
        "@type": "Thing",
        "name": "Car Rental and Travel in Cluj-Napoca",
        "description": "Everything about car rentals, travel tips, and exploring Cluj-Napoca and Transylvania"
      },
      "keywords": [
        "car rental blog",
        "Cluj-Napoca travel",
        "Transylvania guide",
        "Romania tourism",
        "travel tips",
        "automotive news"
      ],
      "inLanguage": ["ro", "en"],
      "audience": {
        "@type": "Audience",
        "name": "Travelers and Car Rental Customers",
        "geographicArea": {
          "@type": "AdministrativeArea",
          "name": "Cluj County, Romania"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://rngo.com/blog"
      },
      "url": "https://rngo.com/blog"
    };
  };

  const blogSchema = generateBlogServiceSchema();

  return (
    <>
      <Head>
        <title>Blog Zetta Cars Cluj-Napoca | Ghiduri Călătorie România - În Curând</title>
        <meta name="description" content="Blog oficial Zetta Cars cu sfaturi de călătorie, ghiduri pentru Cluj-Napoca, noutăți despre mașini de închiriat și articole despre turism în Transilvania - în curând disponibil!" />
        <meta name="keywords" content="blog zetta cars, ghid cluj-napoca, călătorii românia, sfaturi închiriere auto, turism transilvania, blog masini inchiriat" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://rngo.com/blog" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogSchema)
          }}
        />
      </Head>
      <div className="flex flex-col min-h-screen">
      <Header logo={<Logo alt="ZettaCars Logo" />} brandName="ZettaCars" />

      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
            <p className="text-xl text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
          
          {!blogs ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-muted-foreground">Loading blogs...</div>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
                <p className="text-muted-foreground">
                  No blog posts available yet. Check back soon!
                </p>
              </div>
            </div>
          ) : (
            <BlogListClient initialBlogs={blogs} locale="en" />
          )}
        </div>
      </main>

      <Footer
        logo={<Logo alt="ZettaCars Logo" />}
        brandName=""
      />

    </div>
    </>
  )
}
