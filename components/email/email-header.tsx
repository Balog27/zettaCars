import * as React from 'react';
import { Section, Img, Text } from '@react-email/components';

interface EmailHeaderProps {
  title: string;
  logoUrl?: string;
  logoAlt?: string;
}

export const EmailHeader: React.FC<EmailHeaderProps> = ({ 
  title, 
  // Use the public Zetta Cars logo for emails so outgoing messages are correctly branded.
  // Absolute URL is safer for email clients (remote image) than a Next.js image proxy path.
  logoUrl = "https://zettacarrental.com/logo.png",
  logoAlt = "Zetta Cars Logo"
}) => {
  return (
    <Section className="bg-white text-center py-[16px] rounded-t-[8px] border-b border-solid border-gray-200 px-0" style={{ width: '100%' }}>
      <Img
        src={logoUrl}
        alt={logoAlt}
        className="w-[120px] h-auto object-cover mx-auto mb-[8px]"
      />
      <Text className="text-[16px] text-gray-700 m-0">{title}</Text>
    </Section>
  );
}; 
