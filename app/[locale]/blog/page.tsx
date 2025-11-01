'use client';

import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import Head from 'next/head';

export default function BlogPage() {
  const t = useTranslations('blogPage');

  // Generate schema markup for blog
  const generateBlogSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
  "name": "Zetta Cars Blog",
      "description": "Blog about car rentals, travel tips, and driving guides in Cluj-Napoca",
      "publisher": {
        "@type": "Organization",
  "name": "Zetta Cars",
        "url": "https://zettacars.com",
        "logo": "https://zettacars.com/logo.png"
      }
    };
  };

  const blogSchema = generateBlogSchema();

  return (
    <>
      <Head>
  <title>{t('title')} - Zetta Cars</title>
  <meta name="description" content="Zetta Cars Blog - Coming Soon. Stay tuned for tips and insights about car rentals in Cluj-Napoca." />
        <meta name="keywords" content="blog, car rentals, travel tips, Cluj-Napoca, driving guides" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://zettacars.com/blog" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogSchema)
          }}
        />
      </Head>
      <div className="flex flex-col min-h-screen">
  <Header logo={<Image src="/logo.png" alt="Zetta Cars Logo" width={150} height={50} />} brandName="Zetta Cars" />

      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-center">{t('title')}</h1>
        <p className="text-xl text-muted-foreground text-center mt-4">
          {t('subtitle')}
        </p>
      </main>

      <Footer
  logo={<Image src="/logo.png" alt="Zetta Cars Logo" width={150} height={50} />}
        brandName=""
      />

    </div>
    </>
  )
}
