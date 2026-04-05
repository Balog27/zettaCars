"use client";

import * as React from "react";
import { useState } from "react";
import { Star, Send, ArrowLeft, MessageSquare } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useUser, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Rating } from "@/components/ui/rating-group";

export default function ReviewPage() {
  const t = useTranslations('reviewPage');
  const { user: clerkUser, isLoaded } = useUser();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    title: "",
    review: "",
  });

  // Sync clerk user to formData when loaded
  React.useEffect(() => {
     if (isLoaded && clerkUser) {
        setFormData(prev => ({
           ...prev,
           name: clerkUser.fullName || clerkUser.username || "",
           email: clerkUser.primaryEmailAddress?.emailAddress || ""
        }));
     }
  }, [clerkUser, isLoaded]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.rating || !formData.review) {
      toast.error(t('validationFillFields'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Call Convex mutation to create a review
      await createReview({
        name: formData.name,
        email: formData.email || undefined,
        rating: formData.rating,
        title: formData.title || undefined,
        text: formData.review,
        locale: undefined,
      });

      toast.success(t('successToast'));

      // Reset form but keep user info
      setFormData(prev => ({
        ...prev,
        rating: 0,
        title: "",
        review: "",
      }));
    } catch (error) {
      console.error(error);
      toast.error(t('errorToast'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convex mutation
  const createReview = useMutation(api.reviews.createReview);

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header logo={<Logo alt="Zetta Cars Logo" />} />
      
      <main className="flex-grow p-4 md:p-8 bg-background dark:bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backToHome')}
              </Button>
            </Link>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {t('header.title')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('header.subtitle')}
              </p>
            </div>
          </div>

          <SignedIn>
            {/* Review Form */}
            <Card className="max-w-2xl mx-auto bg-card dark:bg-card-darker text-card-foreground">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">
                  {t('card.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t('nameLabel')}</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder={t('namePlaceholder')}
                        value={formData.name}
                        disabled={!!clerkUser}
                        className="bg-gray-50 dark:bg-zinc-900 cursor-not-allowed opacity-80"
                        readOnly
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t('emailLabel')}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      {t('rateLabel')}
                    </Label>
                    <div className="flex items-center">
                      <Rating
                        value={formData.rating}
                        onValueChange={handleRatingChange}
                        size="md"
                      />
                      <span className="ml-4 text-sm text-muted-foreground font-medium">
                        {formData.rating ? `${formData.rating} ${t('outOfFive')}` : t('ratingTextClickToRate')}
                      </span>
                    </div>
                  </div>

                  {/* Review Title */}
                  <div>
                    <Label htmlFor="title">{t('reviewTitleLabel')}</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder={t('reviewTitlePlaceholder')}
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <Label htmlFor="review">{t('reviewLabel')}</Label>
                    <Textarea
                      id="review"
                      placeholder={t('reviewPlaceholder')}
                      value={formData.review}
                      onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                      rows={6}
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('reviewHelpText')}
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-primary/20"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('submitting')}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t('submitButton')}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </SignedIn>

          <SignedOut>
            <div className="max-w-md mx-auto text-center py-12 px-6 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/20">
              <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-pink-500 fill-pink-500/10" />
              </div>
              <h2 className="text-2xl font-bold mb-3">{t('authPrompt.title')}</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                {t('authPrompt.subtitle')}
              </p>
              <SignInButton mode="modal">
                <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-6 rounded-2xl text-lg font-bold shadow-xl shadow-pink-500/20 w-full md:w-auto">
                   {t('authPrompt.button')}
                </Button>
              </SignInButton>
            </div>
          </SignedOut>

          {/* Additional Info */}
          <div className="text-center mt-12 text-muted-foreground">
            <p className="text-sm">
              {t('additionalInfo')}
            </p>
          </div>
        </div>
      </main>

      <Footer
        logo={<Logo alt="Zetta Cars Logo" />}
        brandName=""
      />
    </div>
  );
}