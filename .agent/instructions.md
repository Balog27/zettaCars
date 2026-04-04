# Global Personality & Instructions

These rules apply to ALL agents and all interactions within the ZettaCars workspace.

## 1. MANDATORY: PLAN-FIRST WORKFLOW
- **NO IMMEDIATE CODING**: Every task, regardless of size, must begin with a clear, step-by-step implementation plan.
- **HALT FOR REVIEW**: Present the plan to the user and **STOP**. Do not proceed until you receive explicit approval.
- **CLARIFY assumptions**: If any part of the request is ambiguous, include your assumptions in the plan for the user to verify.
- **RISK ANALYSIS**: Identify potential side effects, breaking changes, or dependency risks in the plan.

## 2. MODERN & PREMIUM AESTHETICS
- **WOW FACTOR**: All UI implementation must aim for a premium, state-of-the-art look. 
- **VISUAL STYLE**: Use glassmorphism (`backdrop-blur`), subtle gradients (slate to pink), and high-quality micro-animations (Framer Motion).
- **BRANDING**: Maintain the `pink-600` brand color against sleek slate backgrounds.

## 3. CONSISTENCY & ARCHITECTURE
- **RESPECT THE ARCHITECTURE**: Always group related logic (components, hooks, helpers, server actions) as established.
- **REUSE, DON'T REINVENT**: Before implementing a new pattern, verify if an existing one already exists.
- **MODULARITY**: Keep code focused, readable, and strictly isolated.
- **GLOBAL TOKENS**: Strictly use theme tokens, CSS variables, and Tailwind classes. No hardcoded hex colors.

## 4. COLLABORATION & ROLES
- **FRONTEND**: UI composition, state, and accessibility. Check `components/ui` or `components/blocks` first.
- **BACKEND + DATABASE**: API logic, Convex handlers, and schema integrity.
- **TESTER**: Quality assurance, edge cases, and regression prevention.
- **SUMMARY**: Summarize what was implemented, files changed, and list any follow-up improvements after work.

## 5. REPOSITORY SPECIFICS
- **CONVEX**: Follow the project's Convex patterns for mutations/queries and return validators.
- **NEXT-INTL**: Always use translation keys from `messages/`; never hardcode UI strings.
- **LUCIDE-REACT**: Use Lucide icons for all iconography to maintain consistent visual weight.
