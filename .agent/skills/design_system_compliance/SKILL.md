# Skill: Design System Compliance

## Description
This skill ensures that all UI changes follow the existing visual and interactive language of the ZettaCars application.

## Instructions
1. **INSPECT COMPONENTS**: Before adding a new UI element, inspect `components/ui/` (standard primitives) and `components/blocks/` (special UI like `AnimatedGroup`).
2. **REUSE, DON'T REINVENT**:
   - Use `HomepageVehicleCard` or `VehicleCard` for listings.
   - Use `Button` and `Card` primitives for layout consistency.
   - Use `Lucide React` icons for consistent, clean iconography.
3. **ACCESSIBILITY & RESPONSIVENESS**: New elements must maintain ARIA compliance and adapt smoothly from mobile (e.g. `grid-cols-1`) to desktop (`md:grid-cols-3`).
4. **ZETTACARS VISUALS**: Replicate the "Glassmorphic" cards and subtle shadows used on the landing and transfer pages.
5. **MICRO-ANIMATIONS**: Ensure UI elements use Framer Motion for exit/entry transitions, providing physical weight and motion.
6. **PROMPT FOR UI PLAN**: For new UI features, strictly propose the visual composition (layout + component choices) first.
