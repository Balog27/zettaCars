# Skill: Refactor Safety & Testing Strategy

## Description
This skill ensures all code changes are safe, tested, and do not break existing functionality.

## Instructions
1. **IDENTIFY RISKS**: Before proposing a change (especially a refactor), list all potential breaking points (e.g. state, URL params, local storage, API contracts).
2. **PLAN TESTING**:
   - For UI changes, identify relevant manual verification steps (Responsive, Accessibility, Interaction).
   - For Logic changes, identify relevant unit test scenarios (Jest, Vitest, Vitest-Next).
   - For Integration/Data changes, identify potential regression points (End-to-end tests).
3. **AVOID UNRELATED CHANGES**: During a specific feature request, strictly avoid fixing other small, unrelated issues (unless explicitly asked). This keeps the PR/Commit clean and safe.
4. **REGRESSION PREVENTION**: If the change involves a critical path (checkout, booking, login), double-verify that old functionality is preserved or migrated correctly.
5. **EDGE CASE ANALYSIS**: Always identify and handle edge cases (empty states, loading, errors, network failure) in the implementation plan.
