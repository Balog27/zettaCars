import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { Logo } from "@/components/ui/logo";
import { getTranslations } from 'next-intl/server';
import { fetchQuery } from 'convex/nextjs';
import { api } from "@/convex/_generated/api";
import { BlogListClient } from "@/components/blog/blog-list-client";
import { Metadata } from 'next';

export const revalidate = 3600; // revalidate every hour

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blogPage' });
  
  return {
    title: `${t('title')} | Zetta Cars Cluj-Napoca`,
    description: t('subtitle'),
    alternates: {
      canonical: `https://www.zettacarrental.com/${locale}/blogs`,
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url: `https://www.zettacarrental.com/${locale}/blogs`,
      siteName: 'Zetta Cars Cluj-Napoca',
      locale: locale,
      type: 'website',
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blogPage' });
  const blogs = await fetchQuery(api.blogs.getAll);

  // Generate schema markup for blog services
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog Zetta Cars Cluj-Napoca",
    "alternateName": "Blog Masini de Inchiriat Cluj",
    "description": "Blog oficial Zetta Cars cu sfaturi de călătorie, ghiduri pentru Cluj-Napoca, noutăți despre mașini de închiriat și articole despre turism în Transilvania.",
    "publisher": {
      "@type": "Organization",
      "name": "Zetta Cars",
      "url": "https://zettacars.ro",
      "logo": "https://zettacars.ro/logo.png",
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
    "inLanguage": ["ro", "en"],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema)
        }}
      />
      <Header logo={<Logo alt="ZettaCars Logo" />} brandName="ZettaCars" />

      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 pb-2 text-black dark:text-white">
              {t('title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
          
          {!blogs || blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">📝</span>
              </div>
              <h2 className="text-2xl font-bold mb-3">Coming Soon</h2>
              <p className="text-muted-foreground max-w-md">
                We're currently working on some exciting guides and travel tips. Check back later!
              </p>
            </div>
          ) : (
            <BlogListClient initialBlogs={blogs} locale={locale} />
          )}
        </div>
      </main>

      <Footer
        logo={<Logo alt="ZettaCars Logo" />}
        brandName="Zetta Cars"
      />
    </div>
  );
}
