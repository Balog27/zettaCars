import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      personalInfo,
      transferDetails,
      pricing,
      locale = 'en',
    } = body;

    if (!personalInfo?.email || !personalInfo?.name) {
      return NextResponse.json(
        { error: 'Missing required personal information' },
        { status: 400 }
      );
    }

    if (!transferDetails) {
      return NextResponse.json(
        { error: 'Missing transfer details' },
        { status: 400 }
      );
    }

    const adminEmail = 'contact@zettacarrental.com';
    const customerEmail = personalInfo.email;
    const isRo = locale === 'ro';

    // Format date
    const transferDate = new Date(transferDetails.transferDate);
    const formattedDate = transferDate.toLocaleDateString(isRo ? 'ro-RO' : 'de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // Format price
    const formatPrice = (amount?: number) => {
      if (amount === undefined) return '-';
      return `${amount.toFixed(2)} ${pricing?.currency || 'EUR'}`;
    };

    const priceDisplay = pricing?.isSingle
      ? formatPrice(pricing?.price)
      : `${formatPrice(pricing?.min)} - ${formatPrice(pricing?.max)}`;

    // Translations
    const adminT = {
      subject: `New Transfer Request from ${personalInfo.name}`,
      title: isRo ? 'Cerere de Transfer Nouă' : 'New Transfer Request',
      customerInfo: isRo ? 'Informații Client' : 'Customer Information',
      name: isRo ? 'Nume' : 'Name',
      email: isRo ? 'Email' : 'Email',
      phone: isRo ? 'Telefon' : 'Phone',
      flightNumber: isRo ? 'Numărul Zborului' : 'Flight Number',
      message: isRo ? 'Mesaj' : 'Message',
      transferDetails: isRo ? 'Detalii Transfer' : 'Transfer Details',
      pickupLocation: isRo ? 'Locație Ridicare' : 'Pickup Location',
      dropoffLocation: isRo ? 'Locație Destinație' : 'Dropoff Location',
      date: isRo ? 'Data Transfer' : 'Date',
      time: isRo ? 'Ora Ridicării' : 'Time',
      category: isRo ? 'Categorie' : 'Category',
      persons: isRo ? 'Persoane' : 'Persons',
      distance: isRo ? 'Distanță' : 'Distance',
      pricing: isRo ? 'Estimare Preț' : 'Price Estimate',
      basePrice: isRo ? 'Preț de Bază' : 'Base Price',
      action: isRo ? 'Acțiune necesară: Revizuiți cererea și contactați clientul pentru confirmare.' : 'Action Required: Review the request and contact the customer for confirmation.',
    };

    const userT = {
      subject: isRo ? 'Cerere de Transfer Primită' : 'Transfer Request Received',
      greeting: isRo ? `Bună ${personalInfo.name},` : `Hello ${personalInfo.name},`,
      confirmationMessage: isRo
        ? 'Am primit cererea ta de transfer. Detaliile cererii sunt prezentate mai jos.'
        : 'We have received your transfer request. Your request details are shown below.',
      transferDetails: isRo ? 'Detalii Transfer' : 'Transfer Details',
      pickupLocation: isRo ? 'Locație Ridicare' : 'Pickup Location',
      dropoffLocation: isRo ? 'Locație Destinație' : 'Dropoff Location',
      date: isRo ? 'Data Transfer' : 'Date',
      time: isRo ? 'Ora Ridicării' : 'Time',
      category: isRo ? 'Categorie' : 'Category',
      persons: isRo ? 'Persoane' : 'Persons',
      distance: isRo ? 'Distanță' : 'Distance',
      flightNumber: isRo ? 'Numărul Zborului' : 'Flight Number',
      message: isRo ? 'Mesaj' : 'Message',
      pricing: isRo ? 'Estimare Preț' : 'Price Estimate',
      basePrice: isRo ? 'Preț de Bază' : 'Base Price',
      nextSteps: isRo
        ? 'Vom revizui cererea ta și te vom contacta cât mai curând posibil în maximum 6 ore pentru a confirma disponibilitatea și a finaliza prețul.'
        : 'We will review your request and contact you as soon as possible within 6 hours to confirm availability and finalize the price.',
      contact: isRo ? 'Dacă ai întrebări, nu ezita să ne contactezi:' : 'If you have any questions, feel free to contact us:',
      thank: isRo ? 'Mulțumim,\nEchipa Zetta Cars' : 'Thank you,\nZetta Cars Team',
    };

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h1 style="color: #1a365d; border-bottom: 2px solid #ec4899; padding-bottom: 10px;">${adminT.title}</h1>
        
        <h2 style="color: #374151; font-size: 18px; margin-top: 20px;">${adminT.customerInfo}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; color: #666;">${adminT.name}:</td>
            <td style="padding: 8px; font-weight: bold;">${personalInfo.name}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 8px; color: #666;">${adminT.email}:</td>
            <td style="padding: 8px;">${personalInfo.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #666;">${adminT.phone}:</td>
            <td style="padding: 8px;">${personalInfo.phone}</td>
          </tr>
          ${personalInfo.flightNumber ? `<tr style="background-color: #f9fafb;">
            <td style="padding: 8px; color: #666;">${adminT.flightNumber}:</td>
            <td style="padding: 8px;">${personalInfo.flightNumber}</td>
          </tr>` : ''}
          ${personalInfo.message ? `<tr>
            <td style="padding: 8px; color: #666;">${adminT.message}:</td>
            <td style="padding: 8px;">${personalInfo.message}</td>
          </tr>` : ''}
        </table>

        <h2 style="color: #374151; font-size: 18px; margin-top: 20px;">${adminT.transferDetails}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; color: #666;">${adminT.pickupLocation}:</td>
            <td style="padding: 8px; font-weight: bold;">${transferDetails.pickupLocation}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 8px; color: #666;">${adminT.dropoffLocation}:</td>
            <td style="padding: 8px; font-weight: bold;">${transferDetails.dropoffLocation}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #666;">${adminT.date}:</td>
            <td style="padding: 8px;">${formattedDate} at ${transferDetails.pickupTime}</td>
          </tr>
          ${transferDetails.category ? `<tr style="background-color: #f9fafb;">
            <td style="padding: 8px; color: #666;">${adminT.category}:</td>
            <td style="padding: 8px; text-transform: capitalize;">${transferDetails.category}</td>
          </tr>` : ''}
          ${transferDetails.persons ? `<tr>
            <td style="padding: 8px; color: #666;">${adminT.persons}:</td>
            <td style="padding: 8px;">${transferDetails.persons}</td>
          </tr>` : ''}
          ${transferDetails.distance ? `<tr style="background-color: #f9fafb;">
            <td style="padding: 8px; color: #666;">${adminT.distance}:</td>
            <td style="padding: 8px;">${transferDetails.distance} km</td>
          </tr>` : ''}
          ${personalInfo.flightNumber ? `<tr>
            <td style="padding: 8px; color: #666;">${adminT.flightNumber}:</td>
            <td style="padding: 8px;">${personalInfo.flightNumber}</td>
          </tr>` : ''}
          ${personalInfo.message ? `<tr style="background-color: #f9fafb;">
            <td style="padding: 8px; color: #666;">${adminT.message}:</td>
            <td style="padding: 8px;">${personalInfo.message}</td>
          </tr>` : ''}
        </table>

        <h2 style="color: #374151; font-size: 18px; margin-top: 20px;">${adminT.pricing}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; color: #666;">${adminT.basePrice}:</td>
            <td style="padding: 8px; font-weight: bold; font-size: 16px;">${priceDisplay}</td>
          </tr>
        </table>

        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-top: 20px;">
          <p style="color: #1e40af; margin: 0;">${adminT.action}</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">© 2025 Zetta Cars. All rights reserved.</p>
      </div>
    `;

    const userHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h1 style="color: #1a365d; border-bottom: 2px solid #ec4899; padding-bottom: 10px;">${userT.subject}</h1>
        
        <p style="font-size: 16px; margin-top: 20px;">${userT.greeting}</p>
        <p>${userT.confirmationMessage}</p>

        <h2 style="color: #374151; font-size: 18px; margin-top: 20px;">${userT.transferDetails}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; color: #666;">${userT.pickupLocation}:</td>
            <td style="padding: 8px; font-weight: bold;">${transferDetails.pickupLocation}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 8px; color: #666;">${userT.dropoffLocation}:</td>
            <td style="padding: 8px; font-weight: bold;">${transferDetails.dropoffLocation}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #666;">${userT.date}:</td>
            <td style="padding: 8px;">${formattedDate} at ${transferDetails.pickupTime}</td>
          </tr>
          ${transferDetails.category ? `<tr style="background-color: #f9fafb;">
            <td style="padding: 8px; color: #666;">${userT.category}:</td>
            <td style="padding: 8px; text-transform: capitalize;">${transferDetails.category}</td>
          </tr>` : ''}
          ${transferDetails.persons ? `<tr>
            <td style="padding: 8px; color: #666;">${userT.persons}:</td>
            <td style="padding: 8px;">${transferDetails.persons}</td>
          </tr>` : ''}
          ${transferDetails.distance ? `<tr style="background-color: #f9fafb;">
            <td style="padding: 8px; color: #666;">${userT.distance}:</td>
            <td style="padding: 8px;">${transferDetails.distance} km</td>
          </tr>` : ''}
          ${personalInfo.flightNumber ? `<tr>
            <td style="padding: 8px; color: #666;">${userT.flightNumber}:</td>
            <td style="padding: 8px;">${personalInfo.flightNumber}</td>
          </tr>` : ''}
          ${personalInfo.message ? `<tr style="background-color: #f9fafb;">
            <td style="padding: 8px; color: #666;">${userT.message}:</td>
            <td style="padding: 8px;">${personalInfo.message}</td>
          </tr>` : ''}
        </table>

        <h2 style="color: #374151; font-size: 18px; margin-top: 20px;">${userT.pricing}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; color: #666;">${userT.basePrice}:</td>
            <td style="padding: 8px; font-weight: bold; font-size: 16px;">${priceDisplay}</td>
          </tr>
        </table>

        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-top: 20px;">
          <p style="color: #1e40af; margin: 0;">${userT.nextSteps}</p>
        </div>

        <h3 style="color: #374151; margin-top: 20px;">${userT.contact}</h3>
        <p style="font-weight: bold; font-size: 14px;">contact@zettacarrental.com</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="white-space: pre-line; color: #333;">${userT.thank}</p>
        <p style="color: #999; font-size: 12px;">© 2025 Zetta Cars. All rights reserved.</p>
      </div>
    `;

    try {
      // Send HTML emails to both admin and customer
      const [adminResult, userResult] = await Promise.all([
        resend.emails.send({
          from: 'contact@zettacarrental.com',
          to: adminEmail,
          subject: adminT.subject,
          html: adminHtml,
          replyTo: customerEmail,
        }),
        resend.emails.send({
          from: 'contact@zettacarrental.com',
          to: customerEmail,
          subject: userT.subject,
          html: userHtml,
          replyTo: adminEmail,
        }),
      ]);

      // Check for errors
      if ((adminResult as any)?.error) {
        console.error('Transfer request admin email error:', (adminResult as any).error);
      }

      if ((userResult as any)?.error) {
        console.error('Transfer request user email error:', (userResult as any).error);
      }

      console.info('Transfer request emails sent', {
        adminMessageId: (adminResult as any)?.data?.id,
        userMessageId: (userResult as any)?.data?.id,
        customerEmail,
      });

      return NextResponse.json({
        success: true,
        adminMessageId: (adminResult as any)?.data?.id,
        userMessageId: (userResult as any)?.data?.id,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Return success anyway - don't block form submission if email fails
      return NextResponse.json({
        success: true,
        warning: 'Transfer request received but email notification may have failed',
      });
    }
  } catch (error) {
    console.error('Transfer request API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as any)?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
