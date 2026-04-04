# Skill: Architecture Compliance

## Description
This skill enforces the project's folder structure, module boundaries, and established patterns.

## Instructions
1. **UNDERSTAND CONTEXT**: Before proposing a change, identify the current folder structure (`app/`, `components/`, `convex/`, `lib/`, `hooks/`, `types/`).
2. **RESPECT BOUNDARIES**:
   - Keep UI components in `components/`.
   - Keep business logic in `convex/` (server side) or `lib/` (shared).
   - Keep page-specific layouts and routing in `app/`.
   - Keep state/interaction hooks in `hooks/`.
3. **REUSE PATTERNS**:
   - Favor existing Convex query/mutation patterns.
   - Favor existing Next.js server actions or API routes.
   - Favor existing utilities in `lib/` or `types/`.
4. **FLAG CONFLICTS**: If a user request requires a "quick fix" that breaks these boundaries, flag it and propose an architecture-aligned alternative.
5. **MODULARITY**: Promote high cohesion (related code together) and low coupling (minimal dependencies between unrelated segments).
