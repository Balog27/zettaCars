"use client";

import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}

export function Logo({ width = 150, height = 50, alt = "Zetta Cars Logo", className }: LogoProps) {
  return (
    <div className={className}>
      <Image
        src="/logo.png"
        alt={alt}
        width={width}
        height={height}
        className="block dark:hidden"
      />
      <Image
        src="/logoWhite.png"
        alt={alt}
        width={width}
        height={height}
        className="hidden dark:block"
      />
    </div>
  );
}