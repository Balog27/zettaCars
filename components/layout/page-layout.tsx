"use client";

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Logo } from "@/components/ui/logo";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header logo={<Logo alt="Zetta Cars Logo" />} />
      
      <main className={`flex-grow ${className}`}>
        {children}
      </main>
      
      <Footer 
        logo={<Logo alt="Zetta Cars Logo" />} 
        brandName=""
      />
    </div>
  );
} 