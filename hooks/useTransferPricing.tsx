"use client";

import { useState } from "react";

export function useTransferPrice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function calculate(p: { pickup: any; dropoff: any; category: string; pricing: any }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/transfer-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Calculation failed');
      return data;
    } catch (err: any) {
      setError(err.message || String(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { calculate, loading, error } as const;
}
