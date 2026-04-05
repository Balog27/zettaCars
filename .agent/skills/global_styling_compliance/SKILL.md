# Skill: Global Styling / Theme Compliance

## Description
This skill enforces that CSS, Tailwind, or styling configuration is centralized and reusable, adhering to the ZettaCars "Premium Modern" aesthetic.

## Instructions
1. **CENTRALIZED STYLING ONLY**: Identify and use existing global styling tokens, or Tailwind theme values (e.g., in `index.css`).
2. **THEME PALETTE**:
   - **Primary Action**: `pink-600` (hex: #db271b in some spots, check `tailwind.config`). 
   - **Backgrounds**: Use deep `slate-900` or absolute black for dark mode; `slate-50` for light mode.
   - **Text**: `slate-100/200` for dark backgrounds, `slate-950` for light.
3. **MODERN EFFECTS**:
   - **Glassmorphism**: Use `backdrop-blur-*` with semi-transparent backgrounds for cards and modals.
   - **Gradients**: Use linear-gradients involving `slate-900` and `pink-600/80` for high-end sections.
4. **NO HARDCODED VALUES**: Strictly avoid raw hex, RGB, or HSL strings in component files. Use Tailwind classes or CSS variables.
5. **MICRO-ANIMATIONS**: Use `framer-motion` for subtle entrance/hover effects.
6. **ACCESSIBILITY**: Ensure color contrast remains readable across both themes.
7. **CONSISTENCY**: When a requested change requires a new color, shadow, or spacing, add it to the global configuration first.
