# ZettaCars Application Overview

Welcome to the ZettaCars technical documentation. This document provides a comprehensive analysis of the project's architecture, technology stack, and core business processes.

## 1. Architecture Overview

ZettaCars is built as a high-performance, modern web application using a **Full-Stack Serverless Architecture**.

### The Core Pillars:
- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router) — Provides server-side rendering (SSR), static site generation (SSG) for blogs, and localized routing.
- **Backend & Database**: [Convex](https://www.convex.dev/) — A real-time backend-as-a-service that replaces traditional REST/GraphQL APIs with type-safe, real-time sync hooks.
- **Authentication**: [Clerk](https://clerk.com/) — Handles identity, user profiles, and session management.
- **Localization**: [next-intl](https://next-intl-docs.vercel.app/) — Manages internationalization for Romanian (`ro`) and English (`en`).

---

## 2. Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Core application framework. |
| **Styling** | Tailwind CSS 4 | Utility-first styling with modern CSS features. |
| **UI Components** | HeroUI & Radix UI | Premium, accessible UI primitives. |
| **Animations** | Framer Motion | Smooth transitions and interactive micro-animations. |
| **Forms** | react-hook-form + Zod | Type-safe form handling and rigorous validation. |
| **Icons** | Lucide React | Modern, consistent icon set. |
| **Real-time API** | Convex | Direct reactive data sync. |
| **Auth** | Clerk | Secure login and user management. |
| **Localization** | next-intl | Multi-language support. |
| **Emails** | Resend + React Email | Transactional notifications. |
| **Maps** | Mapbox / Google Maps | Location searching and distance calculation. |

---

## 3. Core Modules & Entities

### 3.1. Vehicles & Pricing
The car inventory is managed in Convex. Each vehicle has:
- **Pricing Tiers**: Dynamic pricing based on rental duration (e.g., 1-3 days vs 7+ days).
- **Categorization**: Grouped by Type (Comfort, SUV, Premium) and Class (Hatchback, Sedan).
- **Availability**: Tracked via status flags (`available`, `rented`, `maintenance`).

### 3.2. Reservation System
The heart of the application. It handles:
- **Pickup/Return**: Date, time, and location selection.
- **Protection Logic**: Choice between **SCDW** (Super Collision Damage Waiver with zero deductible) and **Standard Warranty** (refundable deposit).
- **Seasonal Multipliers**: Automatically adjusts prices during peak seasons (Summer, Holidays) using multipliers defined in the `seasons` table.
- **Extras**: Real-time calculation of snow chains, child seats, and extra kilometer packages.

### 3.3. Luxury Transfers
A specialized module for point-to-point transfers. It uses a different pricing model (Fixed per category or Per-km) and allows users to request custom quotes via `transferRequests`.

### 3.4. Vouchers & Promotions
The `vouchers` system allows for:
- Percentage or fixed-amount discounts.
- Usage limits and account-specific restrictions.
- Category-specific eligibility (Only for Rents or only for Transfers).

---

## 4. Rendering & Routing Logic

### 4.1. Localization Strategy
The app uses a **Segment-based Localization** (`[locale]`) pattern.
- Routes like `/en/cars` or `/ro/cars` are automatically generated.
- Translation keys are stored in `messages/en.json` and `messages/ro.json`.
- The `i18n.ts` file configures the loading mechanism for these translations.

### 4.2. Middleware & Protection (`middleware.ts`)
The application implements two layers of middleware:
1. **Intl Middleware**: Handles locale detection and URL prefixing.
2. **Admin Shield**: Protects the `/admin` routes. It uses Clerk to verify if the authenticated user's ID or email is present in the admin whitelist before allowing access.

### 4.3. Server vs Client Components
- **Server Components**: Used for SEO-heavy pages (Home, Blogs, Car details) to ensure instant loading.
- **Client Components**: Used for interactive features (Search bars, Reservation multi-step forms, Admin dashboards) where immediate UI response is required.

---

## 5. Data Flow & State Management

ZettaCars avoids bulky state management libraries like Redux by leveraging **Reactive Sync**:
- **Convex Queries**: Components subscribe to data (e.g., `useQuery(api.vehicles.list)`). When the database updates (e.g., an admin edits a price), all connected clients update instantly without a page refresh.
- **Convex Mutations**: Actions like `useMutation(api.reservations.create)` send data directly to the server with built-in optimistic updates for a snappy feel.

---

## 6. Email & Communications
The app uses **Resend** for reliable delivery.
- **Templates**: Built with `react-email` templates located in `app/api/send`.
- **Flow**: When a reservation is created, a background mutation triggers an API call to send a confirmation email to both the client and the ZettaCars team.

---

## 7. Component Relationships

### Hierarchical Structure:
1.  **Global Providers (`app/providers.tsx`)**: Wraps the app in Clerk, Convex, HeroUI, and Theme providers.
2.  **Layouts**:
    *   `app/layout.tsx`: Root layout (fonts, metadata).
    *   `app/[locale]/layout.tsx`: Language provider and navigation.
    *   `components/layout/page-layout.tsx`: Wrapper for consistent padding and footer across pages.
3.  **Specific Features**:
    *   `components/reservation/*`: Domain-specific components for the booking funnel.
    *   `components/admin/*`: Specialized dashboard components.
    *   `components/ui/*`: Reusable atomic UI elements.

---

## 8. Development Standards
- **Validation**: Every form is backed by a Zod schema to prevent invalid data from reaching Convex.
- **Typing**: Strict TypeScript is used throughout the project to minimize runtime errors.
- **Styling**: Tailwind CSS 4 variables are used for theme consistency (colors, rounded corners).

---

> [!TIP]
> To see the backend in action, run `npx convex dashboard` to inspect the real-time tables and functions.
