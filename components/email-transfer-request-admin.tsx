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

interface TransferRequestAdminEmailProps {
  data: EmailData;
}

const TransferRequestAdminEmail: React.FC<TransferRequestAdminEmailProps> = ({ data }) => {
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
    title: isRo ? 'Cerere de Transfer Nouă' : 'New Transfer Request',
    customerInfo: isRo ? 'Informații Client' : 'Customer Information',
    name: isRo ? 'Nume:' : 'Name:',
    email: isRo ? 'Email:' : 'Email:',
    phone: isRo ? 'Telefon:' : 'Phone:',
    message: isRo ? 'Mesaj:' : 'Message:',
    transferDetails: isRo ? 'Detalii Transfer' : 'Transfer Details',
    pickupLocation: isRo ? 'Locație Ridicare:' : 'Pickup Location:',
    dropoffLocation: isRo ? 'Locație Destinație:' : 'Dropoff Location:',
    transferDate: isRo ? 'Data Transfer:' : 'Transfer Date:',
    pickupTime: isRo ? 'Ora Ridicării:' : 'Pickup Time:',
    category: isRo ? 'Categorie:' : 'Category:',
    persons: isRo ? 'Persoane:' : 'Persons:',
    distance: isRo ? 'Distanță:' : 'Distance:',
    pricing: isRo ? 'Estimare Preț' : 'Price Estimate',
    basePrice: isRo ? 'Preț de Bază:' : 'Base Price:',
    actionRequired: isRo
      ? 'Acțiune necesară: Revizuiți cererea și contactați clientul pentru confirmare.'
      : 'Action Required: Review the request and contact the customer for confirmation.',
  };

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', paddingBottom: '8px' }}>
      <Text style={{ margin: 0, color: '#666', fontSize: '14px' }}>{label}</Text>
      <Text style={{ margin: 0, color: '#111', fontSize: '14px', fontWeight: '500' }}>{value}</Text>
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
            {/* Customer Information */}
            <Section className="py-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">{t.customerInfo}</Text>
              <DetailRow label={t.name} value={personalInfo.name} />
              <DetailRow label={t.email} value={personalInfo.email} />
              <DetailRow label={t.phone} value={personalInfo.phone} />
              {personalInfo.message && (
                <DetailRow label={t.message} value={personalInfo.message} />
              )}
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
            </Section>

            <Hr className="border-gray-300 my-6" />

            {/* Action Required */}
            <Section className="py-6 px-4 rounded" style={{ backgroundColor: '#EBF8FF', borderColor: '#BEE3F8', borderWidth: '1px' }}>
              <Text className="text-sm text-blue-900" style={{ color: '#1a365d', margin: 0 }}>{t.actionRequired}</Text>
            </Section>
          </Container>

          <EmailFooter />
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TransferRequestAdminEmail;
