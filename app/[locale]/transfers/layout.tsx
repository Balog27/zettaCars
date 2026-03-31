import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'transfersPage' });

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `https://zettacarrental.com/${locale}/transfers`,
    },
  };
}

export default function TransfersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
