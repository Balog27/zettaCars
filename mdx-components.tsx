import { useMemo } from "react";

// Minimal MDX components helper used by MDXRemote `components` prop.
// The real project may provide more components (a, img, pre, code, etc.).
// This stub merges any custom components passed by callers and returns them.

export type MDXCustomComponents = Record<string, any>;

function safeChildValue(child: any) {
  if (child === null || child === undefined) return "";
  if (typeof child === "string" || typeof child === "number") return child;
  // React element -> return as-is
  if (child && typeof child === "object" && child.$$typeof) return child;
  // Fallback: stringify objects/arrays (truncate to avoid huge injections)
  try {
    const s = typeof child === "object" ? JSON.stringify(child) : String(child);
    return s.length > 500 ? s.slice(0, 500) + "…" : s;
  } catch {
    return String(child);
  }
}

function makeSafeHeading(tag: string) {
  // Return a React component for h1..h6 that coerces unsafe children.
  // eslint-disable-next-line react/display-name
  return function SafeHeading(props: any) {
    const { children, ...rest } = props;
    const normalized = Array.isArray(children)
      ? children.map(safeChildValue)
      : safeChildValue(children);
    // Use JSX runtime via React.createElement to preserve tag
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const React = require("react");
    return React.createElement(tag, rest, normalized);
  };
}

const DEFAULT_SAFE_COMPONENTS: MDXCustomComponents = {
  h1: makeSafeHeading("h1"),
  h2: makeSafeHeading("h2"),
  h3: makeSafeHeading("h3"),
  h4: makeSafeHeading("h4"),
  h5: makeSafeHeading("h5"),
  h6: makeSafeHeading("h6"),
};

export function useMDXComponents(customComponents: MDXCustomComponents = {}) {
  return useMemo(() => ({ ...DEFAULT_SAFE_COMPONENTS, ...customComponents }), [customComponents]);
}

export default useMDXComponents;
