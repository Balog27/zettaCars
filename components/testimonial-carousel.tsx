"use client";

import * as React from "react";
import { Quote, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Review {
  text: string;
  name: string;
  title: string;
}

interface TestimonialCarouselProps {
  title: string;
  reviews: Review[];
}

export function TestimonialCarousel({ title, reviews }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const [leftButtonPressed, setLeftButtonPressed] = React.useState(false);
  const [rightButtonPressed, setRightButtonPressed] = React.useState(false);
  // Auto-rotation every 30 seconds
  React.useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      const len = Array.isArray(reviews) ? reviews.length : 0;
      if (len === 0) return;
      setCurrentIndex((prevIndex) => (prevIndex + 1) % len);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [reviews, isAutoPlaying]);

  // Keep currentIndex within bounds when the reviews array changes
  React.useEffect(() => {
    const len = Array.isArray(reviews) ? reviews.length : 0;
    if (len === 0) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((ci) => Math.min(ci, len - 1));
  }, [reviews]);

  // Defensive: if reviews is missing or empty, render a friendly fallback
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <section className="py-16 px-4 bg-section text-white dark:text-foreground">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-foreground mb-6">{title}</h2>
            <p className="text-lg text-white/90 mb-6">There are no reviews yet. Be the first to leave feedback!</p>
            <div className="flex justify-center">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg shadow-lg"
              >
                <Link href="/review" className="inline-flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Leave a Review
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }


  // Handle navigation with visual feedback
  const handleNavigation = (direction: 'left' | 'right') => {
    // Pause auto-rotation for 60 seconds when user interacts
    setIsAutoPlaying(false);
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 60000);

    if (direction === 'left') {
      setLeftButtonPressed(true);
      setTimeout(() => setLeftButtonPressed(false), 150);
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
      );
    } else {
      setRightButtonPressed(true);
      setTimeout(() => setRightButtonPressed(false), 150);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="py-16 px-4 bg-section text-white dark:text-foreground">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-foreground">
              {title}
            </h2>
          </div>

          {/* Testimonial Content with Navigation */}
          <div className="relative flex items-center justify-center">
            {/* Left Navigation Button */}
            <button
              onClick={() => handleNavigation('left')}
              className={`absolute left-2 md:left-8 z-10 p-2 md:p-3 rounded-full bg-gray-800/10 hover:bg-gray-800/20 dark:bg-white/10 dark:hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary group ${
                leftButtonPressed ? 'scale-110 bg-gray-800/30 dark:bg-white/30' : ''
              }`}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className={`w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-white transition-all duration-200 ${
                leftButtonPressed ? 'scale-110' : 'group-hover:scale-105'
              }`} />
            </button>

            {/* Testimonial Content */}
            <div className="flex-1 max-w-4xl mx-auto px-12 sm:px-16 md:px-20">
              <div className="text-center">
                <div className="mb-8">
                  <Quote className="w-16 h-16 text-primary mx-auto mb-8" />
                </div>
                
                {/* Animated testimonial content */}
                <div className="transition-all duration-500 ease-in-out">
                  <blockquote className="text-lg sm:text-xl md:text-2xl text-white/90 dark:text-gray-300 leading-relaxed mb-8">
                    {currentReview.text}
                  </blockquote>
                  
                  <div className="text-center">
                    <div className="font-semibold text-lg text-white dark:text-white mb-1">
                      {currentReview.name}
                    </div>
                    <div className="text-white/90 dark:text-gray-400">
                      {currentReview.title}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Navigation Button */}
            <button
              onClick={() => handleNavigation('right')}
              className={`absolute right-2 md:right-8 z-10 p-2 md:p-3 rounded-full bg-gray-800/10 hover:bg-gray-800/20 dark:bg-white/10 dark:hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary group ${
                rightButtonPressed ? 'scale-110 bg-gray-800/30 dark:bg-white/30' : ''
              }`}
              aria-label="Next testimonial"
            >
              <ChevronRight className={`w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-white transition-all duration-200 ${
                rightButtonPressed ? 'scale-110' : 'group-hover:scale-105'
              }`} />
            </button>
          </div>

          {/* Review Counter */}
          <div className="text-center mt-8">
            <div className="text-white/90 dark:text-gray-400 mb-6">
              {currentIndex + 1} of {reviews.length}
            </div>
            
            {/* Leave a Review Button */}
            <Button 
              asChild
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link 
                href="/review"
                className="inline-flex items-center"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Leave a Review
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}