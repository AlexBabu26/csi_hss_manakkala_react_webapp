# Migration Plan & Checklist

This document tracks the step-by-step migration from the legacy Vite+React architecture to the new decoupled Next.js + Node.js/Express architecture.

## Phase 1: MVP Setup

### 1. Database Setup
- [x] Design PostgreSQL Schema (`schema.sql`) for Users, Pages Content, and Events.
- [x] Configure connection pooling to Neon DB in Express using `@neondatabase/serverless` and `pg`.
- [x] Create initial database migration/seeding script.

### 2. Backend Core API
- [x] Setup Authentication endpoints (`/api/auth/login`) with `bcrypt` and `jsonwebtoken`.
- [x] Create Content API endpoints for fetching and updating page content.
- [x] Integrate Backblaze B2 for handling secure image uploads via `multer`.
- [x] Implement global error handling and validation middleware using `zod`.

### 3. Frontend Architecture & Design System
- [x] Configure Tailwind CSS in Next.js using specifications from `DESIGN.md` (Primary colors, High Contrast tokens).
- [x] Implement Base Layout components (`Header`, `Footer`).
- [x] Implement the `AccessibilityToolbar` and `SkipNavigation` components.
- [x] Set up state management/context for Accessibility Preferences and Content.

### 4. Public Pages
- [x] Implement **Home Page** with hero section and feature highlights.
- [x] Implement **About Page** detailing mission, leadership, and facilities.
- [x] Implement **Contact Page** with working inquiry form submission.

### 5. Admin CMS (MVP)
- [x] Implement **Login Page** with JWT storage.
- [x] Implement protected route logic for the Admin dashboard.
- [x] Build **Dashboard Overview** and **Manage Home Page** interface.

---

## Phase 2: Dynamic Modules

- [x] Implement **Events API** (CRUD operations) and Events public page.
- [x] Implement **Programs** and **Admissions** public pages.
- [x] Build **Manage Events**, **Manage Programs**, and **Manage Admissions** interfaces in the Admin CMS.
- [x] Integrate React Image Crop for pre-upload image optimizations in the Admin CMS.

---

## Phase 3: Final Polish

- [x] Run full Lighthouse accessibility audits to ensure 100% score.
- [x] Verify Server-Side Rendering (SSR) functionality for SEO optimization on public pages.
- [x] Finalize deployment configuration for Vercel (Frontend) and Node.js PAAS (Backend).