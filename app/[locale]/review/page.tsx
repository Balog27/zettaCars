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

export default function ReviewPage() {
  const t = useTranslations();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    title: "",
    review: "",
  });
  
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.rating || !formData.review) {
      toast.error("Please fill in all required fields");
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

      toast.success("Thank you for your review! It will appear on the homepage shortly.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        rating: 0,
        title: "",
        review: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review. Please try again.");
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
                Back to Home
              </Button>
            </Link>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Share Your Experience
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We'd love to hear about your experience with Zetta Cars. Your feedback helps us improve our services.
              </p>
            </div>
          </div>

          {/* Review Form */}
          <Card className="max-w-2xl mx-auto bg-card dark:bg-card-darker text-card-foreground">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                Leave a Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Star Rating */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Rate Your Experience *
                  </Label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="transition-colors duration-200"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoveredStar || formData.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm text-muted-foreground">
                      {formData.rating ? `${formData.rating} out of 5 stars` : "Click to rate"}
                    </span>
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <Label htmlFor="title">Review Title (Optional)</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Excellent service and clean cars"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                {/* Review Text */}
                <div>
                  <Label htmlFor="review">Your Review *</Label>
                  <Textarea
                    id="review"
                    placeholder="Tell us about your experience with Zetta Cars..."
                    value={formData.review}
                    onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                    rows={6}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Please share details about the vehicle, service, and overall experience.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Review
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center mt-12 text-muted-foreground">
            <p className="text-sm">
              Your review will help other customers make informed decisions and help us improve our services.
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