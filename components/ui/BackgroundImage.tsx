"use client";

import React from "react";

interface BackgroundImageProps {
  bottomGradient?: boolean;
  /** Path to the background image in /public, e.g. '/carInterior.jpg' */
  src?: string;
}

export function BackgroundImage({ bottomGradient = true, src = '/mercedes-background.png' }: BackgroundImageProps) {
  return (
    <div
      className={`absolute inset-x-0 top-0 w-full h-[75vh] -z-10 bg-cover bg-top`}
      style={{ backgroundImage: `url('${src}')` }}
      aria-hidden="true" // Good for accessibility as it's decorative
    >
      {bottomGradient && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      )}
    </div>
  );
}
