# Skill: Pre-Implementation Verification & Self-Check

## Description
This skill ensures that all changes are verified for project-specific rules, consistency, and completeness before presenting them to the user.

## Instructions
1. **ARCHITECTURE CHECK**: Use `Architecture Compliance` to ensure files are placed in correct directories (`app/`, `components/`, `convex/`).
2. **STYLING CHECK**: Use `Global Styling Compliance` to verify all colors use theme tokens and no hex/RGB values are hardcoded.
3. **DESIGN CHECK**: Use `Design System Compliance` to ensure the UI feels modern, "glassy", and uses `Lucide` icons correctly.
4. **I18N CHECK**: Ensure **NO HARDCODED STRINGS** exist in the UI; all text must use `next-intl` (t('key')).
5. **TEST/SAFETY CHECK**: Use `Safe Refactor` to list any regression points or risks if the change involves a core path (e.g. Booking, Payments).
6. **FINAL CLEANUP**: Check for unused imports, debugging `console.log` statements, and messy comments before finishing work.
7. **FOLLOW-UP LIST**: Strictly separate the implementation summary from future improvement suggestions.
