"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import React, { useEffect, useState } from "react";
import { useMDXComponents } from "@/mdx-components";
import { BlogImage } from "./blog-image";

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null,
  );
  const [mdxError, setMdxError] = useState<Error | null>(null);
  const components = useMDXComponents({ BlogImage });

  useEffect(() => {
    const processContent = async () => {
      try {
        const serialized = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeHighlight,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
            ],
          },
        });
        setMdxSource(serialized);
        setMdxError(null);
      } catch (error) {
        // Save the error to state so we can render a friendly fallback
        // and so the ErrorBoundary won't be relied on for serialization failures.
        console.error("Error processing MDX content:", error);
        setMdxError(error instanceof Error ? error : new Error(String(error)));
      }
    };

    processContent();
  }, [content]);

  if (!mdxSource) {
    // If serialization failed, show an explicit error message instead of
    // the ambiguous "Loading" state so we don't hide runtime errors.
    if (mdxError) {
      return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>Sorry — there was a problem processing the article content.</p>
          <details className="whitespace-pre-wrap mt-2 text-xs text-muted-foreground">
            {String(mdxError)}
          </details>
          <pre className="mt-4 overflow-auto text-xs">{content}</pre>
        </div>
      );
    }

    return (
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p>Loading content...</p>
      </div>
    );
  }
  
  // NOTE: The ErrorBoundary class is defined at module scope (below) so its
  // identity is stable across renders. That prevents remounts and makes error
  // handling more predictable.

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20">
      <MDXErrorBoundary>
        <MDXRemote {...mdxSource} components={components} />
      </MDXErrorBoundary>
    </article>
  );
}

// ErrorBoundary to catch render-time errors coming from MDX or custom MDX components
class MDXErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console for now; in production you may send this to an error tracking service
    // Keep the message explicit so we can spot MDX serialization/render errors.
    // eslint-disable-next-line no-console
    console.error("MDX render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>Sorry — there was a problem rendering this article.</p>
          <details className="whitespace-pre-wrap mt-2 text-xs text-muted-foreground">
            {String(this.state.error)}
          </details>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
