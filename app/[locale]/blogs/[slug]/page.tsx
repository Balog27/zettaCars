import { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { BlogDetailClient } from "@/components/blog/blog-detail-client";
import {
  BlogStructuredData,
  BreadcrumbStructuredData,
} from "@/components/blog/blog-structured-data";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { MDXRemote } from "next-mdx-remote/rsc";
import { BlogImage } from "@/components/blog/blog-image";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Logo } from "@/components/ui/logo";

export const revalidate = 3600; // revalidate every hour

interface BlogDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const blogs = await fetchQuery(api.blogs.getAll);
  const locales = ['en', 'ro'];
  
  return blogs.flatMap((blog) => 
    locales.map((locale) => ({
      locale,
      slug: blog.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const blog = await fetchQuery(api.blogs.getBySlug, { slug });

  if (!blog) {
    return {
      title: "Blog Post Not Found | Zetta Cars Cluj",
    };
  }

  const coverImageUrl = blog.coverImageUrl || null;

  const baseUrl = "https://www.zettacarrental.com";

  return {
    title: `${blog.title} | Zetta Cars Blog`,
    description: blog.description,
    authors: [{ name: blog.author }],
    keywords: blog.tags?.join(", "),
    alternates: {
      canonical: `${baseUrl}/${locale}/blogs/${slug}`,
      languages: {
        en: `/en/blogs/${slug}`,
        ro: `/ro/blogs/${slug}`,
      },
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
      url: `${baseUrl}/${locale}/blogs/${slug}`,
      publishedTime: blog.publishedAt
        ? new Date(blog.publishedAt).toISOString()
        : undefined,
      authors: [blog.author],
      tags: blog.tags,
      images: coverImageUrl
        ? [
            {
              url: coverImageUrl,
              alt: blog.title,
              width: 1200,
              height: 630,
            },
          ]
        : [],
      siteName: "Zetta Cars Cluj-Napoca",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: coverImageUrl ? [coverImageUrl] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params;
  const blog = await fetchQuery(api.blogs.getBySlug, { slug });

  if (!blog) {
    notFound();
  }

  const coverImageUrl = blog.coverImageUrl || null;

  const mdxComponents = {
    BlogImage: (props: any) => <BlogImage {...props} />,
  };

  const mdxOptions = {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeHighlight,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <BlogStructuredData
        blog={blog}
        locale={locale}
        slug={slug}
        coverImageUrl={coverImageUrl}
      />
      <BreadcrumbStructuredData blog={blog} locale={locale} slug={slug} />
      
      <Header logo={<Logo alt="ZettaCars Logo" />} brandName="ZettaCars" />
      
      <main className="flex-grow">
        <BlogDetailClient
          blog={blog}
          coverImageUrl={coverImageUrl}
          locale={locale}
          slug={slug}
        >
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20">
            <MDXRemote 
              source={blog.content} 
              components={mdxComponents}
              options={{ mdxOptions: mdxOptions as any }}
            />
          </article>
        </BlogDetailClient>
      </main>

      <Footer
        logo={<Logo alt="ZettaCars Logo" />}
        brandName="Zetta Cars"
      />
    </div>
  );
}