"use client";

import * as React from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

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
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [reviews.length, isAutoPlaying]);

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
    <section className="py-16 px-4 bg-slate-900 text-white">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              {title}
            </h2>
          </div>

          {/* Testimonial Content with Navigation */}
          <div className="relative flex items-center justify-center">
            {/* Left Navigation Button */}
            <button
              onClick={() => handleNavigation('left')}
              className={`absolute left-0 md:left-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary group ${
                leftButtonPressed ? 'scale-110 bg-white/30' : ''
              }`}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className={`w-6 h-6 text-white transition-all duration-200 ${
                leftButtonPressed ? 'scale-110' : 'group-hover:scale-105'
              }`} />
            </button>

            {/* Testimonial Content */}
            <div className="flex-1 max-w-4xl mx-auto px-16 md:px-20">
              <div className="text-center">
                <div className="mb-8">
                  <Quote className="w-16 h-16 text-secondary mx-auto mb-8" />
                </div>
                
                {/* Animated testimonial content */}
                <div className="transition-all duration-500 ease-in-out">
                  <blockquote className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
                    {currentReview.text}
                  </blockquote>
                  
                  <div className="text-center">
                    <div className="font-semibold text-lg text-white mb-1">
                      {currentReview.name}
                    </div>
                    <div className="text-gray-400">
                      {currentReview.title}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Navigation Button */}
            <button
              onClick={() => handleNavigation('right')}
              className={`absolute right-0 md:right-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary group ${
                rightButtonPressed ? 'scale-110 bg-white/30' : ''
              }`}
              aria-label="Next testimonial"
            >
              <ChevronRight className={`w-6 h-6 text-white transition-all duration-200 ${
                rightButtonPressed ? 'scale-110' : 'group-hover:scale-105'
              }`} />
            </button>
          </div>

          {/* Review Counter */}
          <div className="text-center mt-8">
            <div className="text-gray-400">
              {currentIndex + 1} of {reviews.length}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}