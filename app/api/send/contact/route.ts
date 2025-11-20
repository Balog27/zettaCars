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
  const { name, message } = payload as { name?: string; message?: string };

  // Try to fetch the Clerk user's email to use as sender (from)
  let replyTo: string | undefined;
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    // Clerk shape: primaryEmailAddress?.emailAddress or emailAddresses[0]
    replyTo = (user?.primaryEmailAddress as any)?.emailAddress || (user?.emailAddresses && user.emailAddresses[0]?.emailAddress);
  } catch (e) {
    // swallow - not fatal; email will be sent without reply-to
    console.error('contact API: failed to fetch clerk user', e);
  }
  const adminEmail = 'david27balogg@yahoo.com';
  // Prefer a verified sender for deliverability. If EMAIL_FROM is configured, use it as `from`
  // and set the authenticated user's email as `replyTo`. If EMAIL_FROM is not set,
  // fall back to the authenticated user's email, then finally the admin address.
  const verifiedFrom = process.env.EMAIL_FROM;
  const from = verifiedFrom || replyTo || 'david27balogg@yahoo.com';
  const replyToHeader = replyTo || undefined;
  const subject = `Contact form message${name ? ` from ${name}` : ''}`;

  const bodyText = `Name: ${name ?? 'N/A'}\n\nMessage:\n${message ?? ''}`;
  const bodyHtml = `
    <div>
      <p><strong>Name:</strong> ${name ?? 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <div style="white-space:pre-wrap;">${(message ?? '').replace(/</g, '&lt;')}</div>
      <hr />
      <p>Sent from Zetta Cars contact form.</p>
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
      console.error('contact API: resend error', error);

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

    console.info('contact API: email sent', { id: data?.id || null, to: adminEmail, from, replyTo: replyToHeader });

    return NextResponse.json({ success: true, id: data?.id || null });
  } catch (err) {
    console.error('contact API: failed to send email', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
