import { useMemo } from "react";

// Minimal MDX components helper used by MDXRemote `components` prop.
// The real project may provide more components (a, img, pre, code, etc.).
// This stub merges any custom components passed by callers and returns them.

export type MDXCustomComponents = Record<string, any>;

export function useMDXComponents(customComponents: MDXCustomComponents = {}) {
  return useMemo(() => ({ ...customComponents }), [customComponents]);
}

export default useMDXComponents;
