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
  // Optional label (slug or id) to include in ErrorBoundary logs for easier
  // identification when a specific post fails in production.
  debugLabel?: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null,
  );
  const [mdxError, setMdxError] = useState<Error | null>(null);
  const components = useMDXComponents({ BlogImage });
  const [renderWithoutComponents, setRenderWithoutComponents] =
    useState(false);

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
      <MDXErrorBoundary
        debugLabel={undefined}
        mdxSource={mdxSource}
        onError={(err) => setRenderWithoutComponents(true)}
      >
        {/* If a custom MDX component (e.g. BlogImage) crashes in production,
            retry rendering without the custom components to isolate the issue. */}
        {renderWithoutComponents ? (
          <MDXRemote {...mdxSource} />
        ) : (
          <MDXRemote {...mdxSource} components={components} />
        )}
      </MDXErrorBoundary>
    </article>
  );
}

// ErrorBoundary to catch render-time errors coming from MDX or custom MDX components
class MDXErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (e: Error) => void;
    // optional debug props passed from the caller
    debugLabel?: string | undefined;
    mdxSource?: any;
  },
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
    // Log the error and inform the parent that an error occurred so it
    // can decide on a fallback strategy (for example: render without
    // custom MDX components).
    // eslint-disable-next-line no-console
    try {
      const label = this.props.debugLabel ?? "(unknown-post)";
      const stack = info?.componentStack ?? "(no component stack)";
      // Try to include a tiny preview of the compiled MDX to identify the post
      const mdxPreview = (() => {
        try {
          const s = this.props.mdxSource?.compiledSource ?? this.props.mdxSource?.compiled ?? undefined;
          if (!s) return undefined;
          return String(s).slice(0, 300);
        } catch (e) {
          return undefined;
        }
      })();

      console.error("MDX render error:", { label, error, stack, mdxPreview });
    } catch (e) {
      // fallback logging
      // eslint-disable-next-line no-console
      console.error("MDX render error (logging failed):", error, info);
    }
    try {
      this.props.onError?.(error);
    } catch (e) {
      // ignore errors from the callback
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>Sorry — there was a problem rendering this article.</p>
          <details className="whitespace-pre-wrap mt-2 text-xs text-muted-foreground">
            {String(this.state.error)}
          </details>
          <details className="whitespace-pre-wrap mt-2 text-xs text-muted-foreground">
            <summary className="font-medium">Debug info</summary>
            <div>
              <p className="text-xs">Label: {String(this.props.debugLabel ?? "(unknown)")}</p>
              <pre className="text-xs mt-1 max-h-40 overflow-auto">{String(this.props.mdxSource?.compiledSource ?? '').slice(0, 200)}</pre>
            </div>
          </details>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
