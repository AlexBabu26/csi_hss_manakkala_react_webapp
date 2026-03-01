# Tech Stack

**Project:** C.S.I. Higher Secondary School For The Partially Hearing, Manakala

This document outlines the technologies and frameworks used across the application, as well as planned migrations outlined in the [PRD](./PRD.md).

## Architecture Overview

The project uses a decoupled **Client-Server Architecture**:
- **Frontend (Client):** A single-page application (SPA) currently built with React and Vite, with plans to migrate to Next.js for SSR/SSG.
- **Backend (API):** A RESTful API built with Node.js and Express.
- **Database:** Serverless PostgreSQL database for data persistence.
- **File Storage:** Cloud object storage for managing media uploads and assets.

---

## 1. Frontend

### Core
- **React (v19):** UI library for building component-driven user interfaces.
- **Vite:** Next-generation frontend tooling and build runner. *(Note: PRD specifies future migration to Next.js)*
- **TypeScript:** Strongly typed programming language.
- **React Router (v7):** Declarative routing for React web applications.

### Styling & UI
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **React Image Crop:** UI component for cropping images directly in the browser before upload.

---

## 2. Backend

### Core
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Fast, unopinionated, minimalist web framework for building the REST API.
- **TypeScript:** Used alongside `tsx` for running and executing backend code.

### Security & Authentication
- **JSON Web Tokens (JWT):** For stateless, secure API authentication.
- **Bcrypt:** Library for hashing and securing user passwords.
- **Cors:** Express middleware for Cross-Origin Resource Sharing.

### Data Validation & Utility
- **Zod:** TypeScript-first schema declaration and validation library (used for payload validation).
- **Node Cache:** In-memory caching for optimizing recurring database queries and API responses.
- **Compression:** Gzip compression middleware to decrease the size of response bodies.

### File Uploads
- **Multer:** Middleware for handling `multipart/form-data` and managing file uploads.

---

## 3. Database & Storage

### Relational Database
- **Neon Serverless Postgres:** Fully managed serverless PostgreSQL.
- **`@neondatabase/serverless`:** Neon's serverless driver for Edge and Node.js environments.
- **`pg`:** Non-blocking PostgreSQL client for Node.js.

### Cloud Storage
- **Backblaze B2:** S3-compatible cloud storage utilized for handling user-uploaded media (event photos, gallery images, etc.).
- **`backblaze-b2`:** Node.js library for integrating with Backblaze's API.

---

## 4. Development & Build Tools

- **TypeScript (`tsc`):** Static type checking.
- **tsx:** TypeScript execution environment used for running the backend development server and scripts.
- **ESLint / Prettier:** *(Expected)* standard code linting and formatting.

---

## 5. Deployment Architecture (Planned)

Based on the [PRD](./PRD.md), the target production deployment is outlined as follows:
- **Frontend Hosting:** Vercel (Current/Target for Next.js migration).
- **Backend Hosting:** Any Node.js compatible PAAS (e.g., Render, Railway, or Vercel Serverless functions if refactored).
- **Database:** Neon DB.
- **Media Assets:** Backblaze B2.