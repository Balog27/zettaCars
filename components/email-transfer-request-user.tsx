import * as React from 'react';
import {
  Body,
  Head,
  Html,
  Preview,
  Hr,
  Tailwind,
  Text,
  Container,
  Section,
} from '@react-email/components';
import { EmailHeader } from './email/email-header';
import { EmailFooter } from './email/email-footer';

interface EmailData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    message?: string;
    flightNumber?: string;
  };
  transferDetails: {
    pickupLocation: string;
    dropoffLocation: string;
    transferDate: Date;
    pickupTime: string;
    category?: string;
    persons?: number;
    distance?: number;
  };
  pricing: {
    isSingle: boolean;
    price?: number;
    min?: number;
    max?: number;
    currency?: string;
  };
  locale?: 'en' | 'ro';
}

interface TransferRequestUserEmailProps {
  data: EmailData;
}

const TransferRequestUserEmail: React.FC<TransferRequestUserEmailProps> = ({ data }) => {
  const { personalInfo, transferDetails, pricing, locale = 'en' } = data;
  const isRo = locale === 'ro';

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(isRo ? 'ro-RO' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (amount?: number) => {
    if (amount === undefined) return '-';
    return `${amount.toFixed(2)} ${pricing.currency || 'EUR'}`;
  };

  const t = {
    title: isRo ? 'Cerere de Transfer Primită' : 'Transfer Request Received',
    greeting: isRo ? `Bună ${personalInfo.name},` : `Hello ${personalInfo.name},`,
    confirmationMessage: isRo
      ? 'Am primit cererea ta de transfer. Detaliile cererii sunt prezentate mai jos.'
      : 'We have received your transfer request. Your request details are shown below.',
    transferDetails: isRo ? 'Detalii Transfer' : 'Transfer Details',
    pickupLocation: isRo ? 'Locație Ridicare:' : 'Pickup Location:',
    dropoffLocation: isRo ? 'Locație Destinație:' : 'Dropoff Location:',
    transferDate: isRo ? 'Data Transfer:' : 'Transfer Date:',
    pickupTime: isRo ? 'Ora Ridicării:' : 'Pickup Time:',
    category: isRo ? 'Categorie:' : 'Category:',
    persons: isRo ? 'Persoane:' : 'Persons:',
    distance: isRo ? 'Distanță:' : 'Distance:',
    flightNumber: isRo ? 'Numărul Zborului:' : 'Flight Number:',
    message: isRo ? 'Mesaj:' : 'Message:',
    pricing: isRo ? 'Estimare Preț' : 'Price Estimate',
    basePrice: isRo ? 'Preț de Bază:' : 'Base Price:',
    pricingNote: isRo
      ? 'Aceasta este o estimare. Prețul final va fi confirmat după ce revizuim și acceptăm cererea ta.'
      : 'This is an estimate. The final price will be confirmed once we review and accept your request.',
    nextSteps: isRo
      ? 'Vom revizui cererea ta și te vom contacta cât mai curând posibil în maximum 6 ore pentru a confirma disponibilitatea și a finaliza prețul. Un email de confirmare a fost trimis la adresa furnizată.'
      : 'We will review your request and contact you as soon as possible within 6 hours to confirm availability and finalize the price. A confirmation email has been sent to the address you provided.',
    contact: isRo ? 'Dacă ai întrebări, nu ezita să ne contactezi la:' : 'If you have any questions, feel free to contact us at:',
    thankyou: isRo ? 'Mulțumim,\nEchipa Zetta Cars' : 'Thank you,\nZetta Cars Team',
  };

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', paddingBottom: '8px' }}>
      <Text style={{ margin: 0, color: '#666', fontSize: '14px' }}>{label}</Text>
      <Text style={{ margin: 0, color: '#111', fontSize: '14px' }}>{value}</Text>
    </div>
  );

  return (
    <Html lang={isRo ? 'ro' : 'en'} dir="ltr">
      <Tailwind>
        <Head />
        <Preview>{t.title}</Preview>
        <Body className="bg-white font-sans p-0 m-0">
          <EmailHeader title={t.title} />

          <Container className="px-6 py-0">
            {/* Greeting */}
            <Section className="py-6">
              <Text className="text-base text-gray-900 mb-4">{t.greeting}</Text>
              <Text className="text-sm text-gray-700 leading-6">{t.confirmationMessage}</Text>
            </Section>

            <Hr className="border-gray-300 my-6" />

            {/* Transfer Details */}
            <Section className="py-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">{t.transferDetails}</Text>
              <DetailRow label={t.pickupLocation} value={transferDetails.pickupLocation} />
              <DetailRow label={t.dropoffLocation} value={transferDetails.dropoffLocation} />
              <DetailRow label={t.transferDate} value={formatDate(transferDetails.transferDate)} />
              <DetailRow label={t.pickupTime} value={transferDetails.pickupTime} />
              {transferDetails.category && (
                <DetailRow label={t.category} value={<span style={{ textTransform: 'capitalize' }}>{transferDetails.category}</span>} />
              )}
              {transferDetails.persons && (
                <DetailRow label={t.persons} value={transferDetails.persons} />
              )}
              {transferDetails.distance && (
                <DetailRow label={t.distance} value={`${transferDetails.distance} km`} />
              )}
              {personalInfo.flightNumber && (
                <DetailRow label={t.flightNumber} value={personalInfo.flightNumber} />
              )}
              {personalInfo.message && (
                <DetailRow label={t.message} value={personalInfo.message} />
              )}
            </Section>

            <Hr className="border-gray-300 my-6" />

            {/* Pricing */}
            <Section className="py-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">{t.pricing}</Text>
              <DetailRow 
                label={t.basePrice} 
                value={
                  pricing.isSingle
                    ? formatPrice(pricing.price)
                    : `${formatPrice(pricing.min)} - ${formatPrice(pricing.max)}`
                } 
              />
              <Text className="text-sm text-gray-600 italic mt-2">{t.pricingNote}</Text>
            </Section>

            <Hr className="border-gray-300 my-6" />

            {/* Next Steps */}
            <Section className="py-6 px-4 rounded" style={{ backgroundColor: '#EBF8FF', borderColor: '#BEE3F8', borderWidth: '1px' }}>
              <Text className="text-sm leading-6" style={{ color: '#1a365d', margin: 0 }}>{t.nextSteps}</Text>
            </Section>

            <Hr className="border-gray-300 my-6" />

            {/* Contact Information */}
            <Section className="py-6">
              <Text className="text-sm text-gray-700 mb-2">{t.contact}</Text>
              <Text className="text-sm text-gray-900 font-semibold">contact@zettacarrental.com</Text>
            </Section>

            <Hr className="border-gray-300 my-6" />

            {/* Sign off */}
            <Section className="py-6">
              <Text className="text-sm text-gray-700" style={{ whiteSpace: 'pre-line' }}>{t.thankyou}</Text>
            </Section>
          </Container>

          <EmailFooter />
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TransferRequestUserEmail;
