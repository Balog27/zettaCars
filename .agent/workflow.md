# Recommended Collaboration Workflow

These rules define how agents and the user collaborate efficiently to build ZettaCars.

## 1. ANALYSIS & DISCOVERY
- **RECEIVE REQUEST**: The agent analyzes the user's request.
- **IDENTIFY ROLES**: The agent determines if the task involves Frontend, Backend, or both.
- **PROJECT CONTEXT**: The agent uses skills (Architecture, Design, Styling) to understand the current state.

## 2. THE IMPLEMENTATION PLAN (MANDATORY PHASE)
- **CREATE PLAN**: The agent **MUST** present a step-by-step plan.
- **PLAN CONTENT**:
  - **Proposed Changes**: Exact files to be modified and why.
  - **New Files**: Any new components, hooks, or backend modules.
  - **Architecture Alignment**: How it fits the current patterns.
  - **Design/Styling**: Tokens and primitives chosen.
  - **Risks/Dependencies**: Potential side effects or breaking points.
  - **Testing Strategy**: How the changes will be verified.
- **STOP & WAIT**: The agent stops and waits for user approval. **NO CODING ALLOWED UNTIL APPROVED.**

## 3. IMPLEMENTATION (POST-APPROVAL ONLY)
- **FOCUSED CODING**: The agent implements only the approved plan.
- **CONSISTENCY**: All code must follow the Design System and Architecture skills.
- **NO HARDCODING**: All strings must use translation keys; all colors must use theme tokens.

## 4. VERIFICATION & TESTING
- **RUN TESTS**: Propose or run relevant unit/integration tests.
- **MANUAL VERIFICATION**: Verify at multiple breakpoints (Mobile, Desktop).
- **ACCESSIBILITY**: Double-check the UI remains accessible.

## 5. FINAL WRAP-UP
- **IMPLEMENTATION SUMMARY**: Provide a concise summary of what was done.
- **FOLLOW-UPS**: List any future improvements or cleanup needs separately.
