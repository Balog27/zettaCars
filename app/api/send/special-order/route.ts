import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { auth, clerkClient } from '@clerk/nextjs/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  // Ensure the requester is authenticated via Clerk
  const authState = await auth();
  const userId = (authState as any)?.userId;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const { name, email, phone, message } = payload as {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };

  // Try to fetch the Clerk user's email to use as sender (from)
  let replyTo: string | undefined;
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    replyTo = (user?.primaryEmailAddress as any)?.emailAddress || (user?.emailAddresses && user.emailAddresses[0]?.emailAddress);
  } catch (e) {
    console.error('special-order API: failed to fetch clerk user', e);
  }

  const adminEmail = 'contact@zettacarrental.com';
  const from = 'contact@zettacarrental.com';
  const replyToHeader = replyTo || email || undefined;
  const subject = `Special Transfer Request${name ? ` from ${name}` : ''}`;

  const userEmail = email || replyTo || 'unknown@unknown';

  const bodyText = `Name: ${name ?? 'N/A'}\nEmail: ${userEmail}\nPhone: ${phone ?? 'N/A'}\n\nSpecial Order Request:\n${message ?? ''}`;
  const bodyHtml = `
    <div>
      <p><strong>Name:</strong> ${name ?? 'N/A'}</p>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p><strong>Phone:</strong> ${phone ?? 'N/A'}</p>
      <p><strong>Special Order Request:</strong></p>
      <div style="white-space:pre-wrap;">${(message ?? '').replace(/</g, '&lt;')}</div>
      <hr />
      <p>Sent from Zetta Cars special orders form.</p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: adminEmail,
      subject,
      text: bodyText,
      html: bodyHtml,
      replyTo: replyToHeader,
    });

    if (error) {
      console.error('special-order API: resend error', error);

      const name = (error as any)?.name || (error as any)?.type || '';
      const message = (error as any)?.message || JSON.stringify(error);

      if (name.toLowerCase().includes('validation') || message.toLowerCase().includes('not verified') || message.toLowerCase().includes('not_verified')) {
        return NextResponse.json({
          error: 'Resend domain not verified. Please verify your sending domain and add the required DNS records (SPF/DKIM).',
          details: message,
        }, { status: 400 });
      }

      return NextResponse.json({ error: 'Failed to send email', details: message }, { status: 500 });
    }

    console.info('special-order API: email sent', { id: data?.id || null, to: adminEmail, from, replyTo: replyToHeader });

    return NextResponse.json({
      success: true,
      message: 'Special order request sent successfully'
    }, { status: 200 });
  } catch (err: any) {
    console.error('special-order API: unexpected error', err);
    return NextResponse.json({
      error: 'Internal server error',
      details: err?.message || 'Unknown error'
    }, { status: 500 });
  }
}
