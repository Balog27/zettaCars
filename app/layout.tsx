import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Providers } from "./providers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Use the public production domain so social previews and canonical links point to the live site
  metadataBase: new URL("https://www.zettacarrental.com"),
  title: {
    default: "Zetta Cars Cluj-Napoca | Masini de Inchiriat",
    template: "%s | Zetta Cars Cluj-Napoca",
  },
  description:
    "Masini de inchiriat Cluj-Napoca cu Zetta Cars. Car rentals Cluj-Napoca cu prețuri competitive. Servicii profesionale de închiriere auto în Cluj-Napoca.",
  keywords: [
    "masini de inchiriat Cluj-Napoca",
    "car rentals Cluj-Napoca", 
    "rent car Cluj",
    "închiriere auto Cluj",
    "rental cars Cluj-Napoca",
    "închiriat mașini Cluj",
    "Zetta Cars",
  ],
  authors: [{ name: "Zetta Cars" }],
  creator: "Zetta Cars",
  publisher: "Zetta Cars",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    alternateLocale: ["en_US"],
    url: "https://rngo.ro",
    siteName: "Zetta Cars Cluj-Napoca",
    title: "Zetta Cars Cluj-Napoca | Masini de Inchiriat",
    description:
      "Masini de inchiriat Cluj-Napoca cu Zetta Cars. Servicii profesionale de închiriere auto cu prețuri competitive.",
    images: [
      {
        // use the full-width logo intended for social previews (serve from /public)
        url: "/logoFull.jpg",
        width: 1200,
        height: 630,
        alt: "Zetta Cars Cluj-Napoca - Închiriere Mașini",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zetta Cars Cluj-Napoca | Masini de Inchiriat",
    description:
      "Masini de inchiriat Cluj-Napoca cu Zetta Cars. Car rentals Cluj-Napoca cu servicii de calitate.",
    images: ["/logoFull.jpg"],
  },
    icons: {
    // Use the Zetta Cars logo as the favicon and apple-touch icon
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logoFull.jpg",
  },
  alternates: {
    canonical: "https://www.zettacarrental.com",
    languages: {
      "ro-RO": "https://www.zettacarrental.com/ro",
      "en-US": "https://www.zettacarrental.com/en",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
  {/* explicit favicon links to ensure the browser shows a tab image in dev and production */}
  <link rel="icon" href="/logo.png" />
  <link rel="shortcut icon" href="/logo.png" />
  <link rel="apple-touch-icon" href="/logoFull.jpg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>

      <Analytics />

      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');
          `}
      </Script>
    </html>
  );
}
