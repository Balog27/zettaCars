import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useHomepageReviews(limit = 6) {
  const reviews = useQuery(api.reviews.getPublicReviews, { limit });
  const isLoading = reviews === undefined;
  const error = reviews === null;

  return {
    reviews: reviews ?? [],
    isLoading,
    error,
  };
}
