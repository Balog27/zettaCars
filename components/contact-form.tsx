"use client";

import React, { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  t: (key: string) => string;
};

export default function ContactForm({ t }: Props) {
  const { isSignedIn, user } = useUser();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isSignedIn) {
      setError(t('pleaseSignIn') || 'Please sign in to send a message.');
      return;
    }

    if (!message || message.trim().length < 5) {
      setError(t('messageTooShort') || 'Please enter a longer message.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/send/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
        credentials: 'include'
      });

      if (res.status === 401) {
        setError(t('notAuthenticated') || 'You must be signed in to send a message.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload?.error || t('sendFailed') || 'Failed to send message.');
        setLoading(false);
        return;
      }

      const data = await res.json().catch(() => ({}));
      setSuccess(t('sendSuccess') || 'Message sent — we will reply shortly.');
      setName('');
      setMessage('');
    } catch (err: any) {
      setError(err?.message || t('sendFailed') || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  // helper to get translations and fall back to English-only defaults if a key is missing
  const get = (key: string, fallback: string) => {
    try {
      const val = t(key);
      if (!val || typeof val !== 'string' || val.startsWith('contactPage.')) return fallback;
      return val;
    } catch (err) {
      return fallback;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">{get('contactForm.nameLabel', 'Your name')}</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={get('contactForm.namePlaceholder', 'Optional')} />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">{get('contactForm.messageLabel', 'Message')}</label>
          <Textarea
            rows={12}
            className="resize-none min-h-[18rem] w-full"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={get('contactForm.messagePlaceholder', 'Tell us about your transportation needs...')}
          />
        </div>

        <div className="flex items-center space-x-3">
          {!mounted ? (
            // Render a stable placeholder during hydration so server and client markup match.
            <>
              <SignInButton>
                <Button>{get('contactForm.signInButton', 'Sign in to send')}</Button>
              </SignInButton>
              <p className="text-sm text-muted-foreground">{get('contactForm.signInNote', 'You must be signed in to submit this form.')}</p>
            </>
          ) : (
            // After hydration we can safely show the correct UI depending on auth state
            !isSignedIn ? (
              <>
                <SignInButton>
                  <Button>{get('contactForm.signInButton', 'Sign in to send')}</Button>
                </SignInButton>
                <p className="text-sm text-muted-foreground">{get('contactForm.signInNote', 'You must be signed in to submit this form.')}</p>
              </>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading ? (get('contactForm.sending', 'Sending...')) : (get('contactForm.send', 'Send'))}
              </Button>
            )
          )}
        </div>

        {success && <p className="text-sm text-green-600">{success}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>
    </div>
  );
}
