import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { auth, clerkClient } from '@clerk/nextjs/server';
import enMessages from '../../../../messages/en.json';
import roMessages from '../../../../messages/ro.json';

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
  // Send and deliver messages to the Zetta Cars contact inbox. We force both
  // the FROM and TO to contact@zettacarrental.com so Resend sees a verified
  // sending address and the mail lands in the canonical inbox. The
  // authenticated user's email is preserved as Reply-To and is included in
  // the message body so admins can reply to the user.
  const adminEmail = 'contact@zettacarrental.com';
  const from = 'contact@zettacarrental.com';
  const replyToHeader = replyTo || undefined;
  const subject = `Contact form message${name ? ` from ${name}` : ''}`;

  // Include the authenticated user's email (if available) in the message so the admin
  // can easily see which account sent the message. Also keep it as replyTo for quick replies.
  const userEmail = replyTo || 'unknown@unknown';

  const bodyText = `Name: ${name ?? 'N/A'}\nEmail: ${userEmail}\n\nMessage:\n${message ?? ''}`;
  const bodyHtml = `
    <div>
      <p><strong>Name:</strong> ${name ?? 'N/A'}</p>
      <p><strong>Email:</strong> ${userEmail}</p>
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

    const sentId = data?.id || null;

    // Build bilingual confirmation message (English and Romanian) using translations
    // loaded from the project's messages JSON. We interpolate the small
    // "email part" placeholder that was added to the JSON.
    const emailPartEn = replyToHeader ? `: ${replyToHeader}` : '';
    const emailPartRo = replyToHeader ? `: ${replyToHeader}` : '';

    // Safely read the translation templates from the JSON catalog. If the
    // keys aren't present for some reason, fall back to small, generic
    // defaults (without embedding the runtime email piece here).
    // The JSON bodies contain the literal tokens `${emailPartEn}` and
    // `${emailPartRo}` which we replace below with the runtime value.
    const enTpl = (enMessages as any)?.contactPage?.sendConfirmation ?? {
      title: 'Message sent — we will reply shortly.',
      body: 'We will contact you shortly.',
    };

    const roTpl = (roMessages as any)?.contactPage?.sendConfirmation ?? {
      title: 'Mesaj trimis — vă vom răspunde în curând.',
      body: 'Vă vom contacta în curând.',
    };

    // Interpolate the email placeholder. The JSON currently contains the
    // literal strings `${emailPartEn}` and `${emailPartRo}` so we replace
    // those exact tokens with the runtime value we computed above.
    // Interpolate the tokens present in the JSON templates. Keep this
    // tolerant: if the JSON doesn't include the token, the replace call
    // is a no-op and we still return the default/generic body above.
    const en = {
      title: enTpl.title,
      body: (enTpl.body ?? '').replace(/\$\{emailPartEn\}/g, emailPartEn),
    };

    const ro = {
      title: roTpl.title,
      body: (roTpl.body ?? '').replace(/\$\{emailPartRo\}/g, emailPartRo),
    };

    return NextResponse.json({ success: true, id: sentId, message: { en, ro } });
  } catch (err) {
    console.error('contact API: failed to send email', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
