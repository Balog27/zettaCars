"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface BackgroundSlideshowProps {
  images: string[];
  interval?: number;
  className?: string;
  children?: React.ReactNode;
}

export function BackgroundSlideshow({ 
  images, 
  interval = 20000, // 20 seconds
  className = "",
  children 
}: BackgroundSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [objectPosition, setObjectPosition] = useState('20% 60%');

  // Update objectPosition based on viewport width so small screens center the image
  useEffect(() => {
    const updatePosition = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      // Tailwind's md breakpoint ~768px — center on smaller screens
      if (w < 768) {
        setObjectPosition('50% 50%');
      } else {
        setObjectPosition('20% 60%');
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Background ${index + 1}`}
            fill
            className="object-cover"
            style={{ objectPosition }}
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}