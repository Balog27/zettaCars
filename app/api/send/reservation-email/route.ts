import { Resend } from 'resend';
import { NextResponse } from 'next/server';

if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY in environment. Emails will not be sent.');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { to, subject, message, emailType, reservationData, locale = 'ro' } = await request.json();
        const isRo = locale === 'ro';

        // Validate required fields
        if (!to || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: to, subject, message' }, 
                { status: 400 }
            );
        }

        // Create HTML email content
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${subject}</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f9f9f9;
                    }
                    .email-container {
                        background-color: #ffffff;
                        border-radius: 8px;
                        padding: 30px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        border-top: 6px solid ${emailType === 'cancellation' ? '#ef4444' : '#ec4899'};
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #e5e7eb;
                        padding-bottom: 20px;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #1f2937;
                        margin-bottom: 10px;
                    }
                    .email-type {
                        display: inline-block;
                        padding: 6px 14px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    .confirmation { background-color: #d1fae5; color: #065f46; }
                    .modification { background-color: #fef3c7; color: #92400e; }
                    .cancellation { background-color: #fee2e2; color: #991b1b; }
                    .reminder { background-color: #dbeafe; color: #1e40af; }
                    
                    .status-header {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 15px;
                        color: ${emailType === 'cancellation' ? '#991b1b' : '#1f2937'};
                    }

                    .content {
                        margin: 20px 0;
                        font-size: 16px;
                        color: #4b5563;
                        white-space: pre-line;
                    }
                    .reservation-details {
                        background-color: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 6px;
                        padding: 20px;
                        margin: 25px 0;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        padding: 5px 0;
                        border-bottom: 1px solid #f1f5f9;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                    }
                    .detail-label {
                        font-weight: 600;
                        color: #64748b;
                        font-size: 13px;
                    }
                    .detail-value {
                        color: #1e293b;
                        font-weight: 500;
                        font-size: 14px;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 25px;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                        color: #94a3b8;
                        font-size: 13px;
                    }
                    .contact-info {
                        margin-top: 15px;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <div style="text-align:center; margin-bottom:12px;">
                            <img src="https://zettacarrental.com/logo.png" alt="Zetta Cars Logo" style="width:140px; height:auto; display:block; margin:0 auto 10px;" />
                        </div>
                        <span class="email-type ${emailType}">
                            ${emailType === 'confirmation' 
                                ? (isRo ? 'REZERVARE CONFIRMATĂ' : 'RESERVATION CONFIRMED')
                                : emailType === 'cancellation' 
                                ? (isRo ? 'REZERVARE ANULATĂ' : 'RESERVATION CANCELLED')
                                : emailType.toUpperCase()}
                        </span>
                    </div>
                    
                    <div class="status-header">
                        ${emailType === 'confirmation' 
                            ? (isRo ? 'Vești bune!' : 'Good news!') 
                            : emailType === 'cancellation' 
                            ? (isRo ? 'Actualizare Rezervare' : 'Reservation Update') 
                            : (isRo ? 'Salutare!' : 'Hello!')}
                    </div>

                    <div class="content">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    
                    ${reservationData ? `
                    <div class="reservation-details">
                        <h3 style="margin-top: 0; margin-bottom: 15px; color: #1e293b; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">
                            ${isRo ? 'Detalii Rezervare' : 'Reservation Details'}
                        </h3>
                        <div class="detail-row">
                            <span class="detail-label">${isRo ? 'ID Rezervare:' : 'Reservation ID:'}</span>
                            <span class="detail-value">#${reservationData.id}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${isRo ? 'Autovehicul:' : 'Vehicle:'}</span>
                            <span class="detail-value">${reservationData.vehicle}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${isRo ? 'Perioada:' : 'Period:'}</span>
                            <span class="detail-value">${reservationData.dates}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${isRo ? 'Preluare:' : 'Pickup:'}</span>
                            <span class="detail-value">${reservationData.pickup}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${isRo ? 'Returnare:' : 'Return:'}</span>
                            <span class="detail-value">${reservationData.return}</span>
                        </div>
                        <div class="detail-row" style="margin-top: 10px; padding-top: 10px; border-top: 2px solid #e2e8f0;">
                            <span class="detail-label" style="color: #1e293b; font-size: 15px;">${isRo ? 'Preț Total:' : 'Total Price:'}</span>
                            <span class="detail-value" style="color: #ec4899; font-size: 18px; font-weight: bold;">€${reservationData.totalPrice}</span>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="footer">
                        <p>${isRo ? 'Vă mulțumim că ați ales Zetta Cars!' : 'Thank you for choosing Zetta Cars!'}</p>
                        <div class="contact-info">
                            <p>${isRo ? 'Aveți întrebări? Ne puteți contacta la contact@zettacarrental.com' : 'Questions? You can contact us at contact@zettacarrental.com'}</p>
                            <p>${isRo ? 'Zetta Cars - Partenerul tău de încredere' : 'Zetta Cars - Your trusted partner'}</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;


        const { data, error } = await resend.emails.send({
            from: 'contact@zettacarrental.com',
            to: to,
            subject: subject,
            html: htmlContent,
            replyTo: 'contact@zettacarrental.com',
        });
        if (error) {
            console.error('Resend error:', error);

            // Detect domain verification issues and return a clear, actionable message
            const name = (error as any)?.name || (error as any)?.type || '';
            const message = (error as any)?.message || JSON.stringify(error);

            if (name.toLowerCase().includes('validation') || message.toLowerCase().includes('not verified') || message.toLowerCase().includes('not_verified')) {
                return NextResponse.json({
                    error: 'Resend domain not verified. Please verify your sending domain on https://resend.com/domains and add the required DNS records (SPF/DKIM).',
                    details: message,
                }, { status: 400 });
            }

            return NextResponse.json({ error: 'Failed to send email', details: message }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            messageId: data?.id,
            message: 'Email sent successfully' 
        });

    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 
