# Product Requirements Document (PRD)

## 1. Executive Summary

**Problem Statement:** C.S.I. Higher Secondary School For The Partially Hearing in Manakala currently lacks a cohesive, highly accessible digital platform that serves both the public (parents, students, community) and internal staff. Existing communication methods and static information displays are difficult for staff to update and lack the specialized accessibility features required for their primary audience.

**Proposed Solution:** A modern, fully responsive web application with a decoupled Next.js (Frontend) and Node.js (Backend) architecture, supported by a Neon Serverless PostgreSQL database. It will provide a publicly accessible, WCAG-compliant informational website alongside a secure Content Management System (CMS) that allows administrators to easily update content, events, and school programs.

**Success Criteria:**
- **Accessibility:** Achieve a 100% Lighthouse Accessibility score and full WCAG compliance (inclusive of custom font size, contrast, and motion preference toggles).
- **Performance:** Frontend page load times (LCP) under 1.5 seconds, with backend API responses consistently under 200ms.
- **Engagement:** A 30% increase in digital inquiries and resource downloads within the first three months of launch.
- **Maintainability:** 100% of website content (events, staff profiles, programs) must be updatable via the CMS without requiring code deployments.

---

## 2. User Experience & Functionality

### 2.1 User Personas

1. **The Public User (Prospective Parent / Student / Alumni):** Needs clear information on programs, admission processes, and school events. Relies heavily on accessibility features due to potential visual or hearing impairments.
2. **The School Administrator:** Non-technical staff member responsible for keeping the website's content fresh. Needs an intuitive dashboard to upload photos, create events, and edit text blocks.

### 2.2 User Stories & Acceptance Criteria

**As a Public User:**
- **Story:** I want to adjust the website's font size and contrast so that I can easily read the content.
  - **AC:** Accessibility toolbar is present on all public pages.
  - **AC:** Preferences (size, contrast, motion) persist across page navigations and return visits.
- **Story:** I want to view the school's facilities, programs, and admission steps so I can decide if it's the right fit for my child.
  - **AC:** Dedicated pages exist for 'About', 'Programs', and 'Admissions'.
  - **AC:** Content is cleanly structured with descriptive headings and optimized images.
- **Story:** I want to contact the school directly through the website to ask specific questions.
  - **AC:** A functional contact form exists with validation.
  - **AC:** Submissions trigger a confirmation message to the user.

**As a School Administrator:**
- **Story:** I want to securely log into an admin dashboard so that I can manage website content.
  - **AC:** Protected `/admin` route requires JWT authentication.
  - **AC:** Failed logins return clear error messages.
- **Story:** I want to create, edit, and delete school events and news so the community stays informed.
  - **AC:** Dashboard includes an "Events" management interface.
  - **AC:** Users can upload images for events with an integrated cropping tool before saving.
- **Story:** I want to review messages submitted through the public contact form so I can respond to inquiries.
  - **AC:** Dashboard includes an "Inquiries" section listing all form submissions with timestamps.

### 2.3 Non-Goals
- We are **NOT** building a student portal or Learning Management System (LMS) for course delivery or grading.
- We are **NOT** building an online payment gateway for tuition or application fees at this time.

---

## 3. Technical Specifications

### 3.1 Architecture Overview
The system utilizes a modern, decoupled architecture:
- **Frontend (Client):** Next.js (React), replacing the previous Vite setup to leverage Server-Side Rendering (SSR) and Static Site Generation (SSG) for improved SEO and performance. Styling via Tailwind CSS.
- **Backend (API):** Node.js running Express.js to handle business logic, authentication, and database transactions.
- **Database:** Neon Serverless PostgreSQL for scalable, persistent data storage.
- **Storage:** Integration with Backblaze B2 (or similar cloud storage) for handling user-uploaded media (images, PDFs).

### 3.2 Integration Points
- **Authentication:** Custom JWT-based authentication system using `bcrypt` for password hashing.
- **Database Connection:** Backend connects to Neon DB using connection pooling (`pg` and `@neondatabase/serverless`).
- **File Uploads:** Backend utilizes `multer` to process multipart/form-data before shipping to the cloud storage bucket.

### 3.3 Security & Privacy
- **Data Protection:** All passwords are mathematically hashed. No plain-text credentials stored.
- **API Security:** CORS policies strictly configured to only allow traffic from the designated Next.js frontend domain.
- **Rate Limiting:** Implement basic rate limiting on the `/login` and contact form `POST` endpoints to prevent brute-force and spam attacks.

---

## 4. Risks & Roadmap

### 4.1 Phased Rollout
- **Phase 1 (MVP):** Next.js frontend setup, Node.js backend setup, Neon DB migration. Core pages (Home, About, Contact) and the basic Authentication/CMS framework.
- **Phase 2:** Dynamic modules implementation (Events, Programs, Admissions, Gallery) and integrated image cropping.
- **Phase 3:** Advanced Accessibility toolbar implementation, performance audits, Lighthouse score optimization, and production deployment.

### 4.2 Technical Risks
- **Migration Overhead:** Transitioning from Vite to Next.js requires refactoring routing (`react-router-dom` to Next.js App/Pages router) and data fetching paradigms.
- **Media Asset Management:** Ensuring high-resolution image uploads from administrators do not bloat storage costs or degrade frontend performance (mitigated by mandatory image cropping/compression on upload).
- **Cold Starts:** As a serverless database, Neon may experience slight cold-start latency. Connection pooling must be aggressively optimized to maintain the <200ms API response target.