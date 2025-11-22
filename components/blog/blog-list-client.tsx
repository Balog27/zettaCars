"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlogCard, BlogCardSkeleton } from "@/components/blog";
import { useTranslations } from "next-intl";
import { BlogListItem } from "@/types/blog";

interface BlogListClientProps {
  initialBlogs: BlogListItem[];
  locale: string;
}

export function BlogListClient({ initialBlogs, locale }: BlogListClientProps) {
  const t = useTranslations("blogPage");

  // Use initialBlogs for SSR, then subscribe to real-time updates
  const blogs = useQuery(api.blogs.getAll) ?? initialBlogs;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold mb-2">{t("noBlogsFound")}</h2>
            <p className="text-muted-foreground">{t("noBlogsDescription")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {blogs.map((blog: BlogListItem) => (
              <BlogCard key={blog._id} blog={blog} locale={locale} />
            ))}
          </div>
        )}
      </div>
  );
}
