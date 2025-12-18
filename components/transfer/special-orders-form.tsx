"use client";

import React, { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function SpecialOrdersForm() {
  const t = useTranslations('transfersPage');
  const { isSignedIn, user } = useUser();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isSignedIn) {
      setError(t('specialOrders.pleaseSignIn') || 'Please sign in to send a special order request.');
      return;
    }

    if (!message || message.trim().length < 10) {
      setError(t('specialOrders.messageTooShort') || 'Please enter a longer message (at least 10 characters).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/send/special-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: (name.trim() || user?.fullName) ?? 'Guest',
          email: (email.trim() || user?.primaryEmailAddress?.emailAddress) ?? '',
          phone: phone.trim(),
          message: message.trim()
        }),
        credentials: 'include'
      });

      if (res.status === 401) {
        setError(t('specialOrders.notAuthenticated') || 'You must be signed in to send a request.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload?.error || t('specialOrders.sendFailed') || 'Failed to send request.');
        setLoading(false);
        return;
      }

      setSuccess(t('specialOrders.sendSuccess') || 'Special order request sent — we will reply shortly.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err?.message || t('specialOrders.sendFailed') || 'Failed to send request.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="rounded-2xl shadow-lg overflow-hidden bg-card dark:bg-card-darker border border-gray-200 dark:border-gray-700 p-8 h-64 flex items-center justify-center">
        <p className="text-muted-foreground">Loading special orders form...</p>
      </div>
    );
  }

  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden bg-card dark:bg-card-darker border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle>
          {t('specialOrders.title') ?? 'Special Orders'}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-foreground">
        {!isSignedIn ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <p className="text-center text-muted-foreground">
              {t('specialOrders.signInPrompt') ?? 'Sign in to submit a special order request'}
            </p>
            <SignInButton mode="modal">
              <Button className="!bg-pink-500 hover:!bg-pink-600 !text-white">
                {t('specialOrders.signIn') ?? 'Sign In'}
              </Button>
            </SignInButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {t('specialOrders.nameLabel') ?? 'Your Name'}
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={user?.fullName || t('specialOrders.namePlaceholder') || 'Pop Andrei'}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {t('specialOrders.emailLabel') ?? 'Email'}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={user?.primaryEmailAddress?.emailAddress || t('specialOrders.emailPlaceholder') || 'andrei.pop@example.com'}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {t('specialOrders.phoneLabel') ?? 'Phone'}
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('specialOrders.phonePlaceholder') || '+40 750 250 121'}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {t('specialOrders.messageLabel') ?? 'Special Order Details'}
              </label>
              <Textarea
                rows={6}
                className="resize-none w-full"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('specialOrders.messagePlaceholder') ?? 'Describe your special transfer request, group size, specific requirements, and if you need station time, how long?'}
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-100 text-red-800 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-green-100 text-green-800 text-sm">
                {success}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full !bg-pink-500 hover:!bg-pink-600 !text-white"
            >
              {loading ? (t('specialOrders.sending') ?? 'Sending...') : (t('specialOrders.sendButton') ?? 'Send Special Order')}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
