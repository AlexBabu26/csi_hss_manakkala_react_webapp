# 🏗️ System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Browser                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                        │  │
│  │                                                            │  │
│  │  ├─ Public Pages (Home, About, Programs, etc.)           │  │
│  │  ├─ Admin Panel (Protected Routes)                       │  │
│  │  ├─ Context (Auth, Content, Accessibility)               │  │
│  │  └─ API Client (lib/api.ts)                              │  │
│  │                                                            │  │
│  │          http://localhost:3000                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            │ HTTP/HTTPS                          │
│                            │ + JWT Token                         │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express.js Backend API                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   API Endpoints                           │  │
│  │                                                            │  │
│  │  ├─ /api/auth/*      (Authentication)                    │  │
│  │  ├─ /api/content/*   (Content Management)                │  │
│  │  └─ /api/events/*    (Events Management)                 │  │
│  │                                                            │  │
│  │  Middleware: JWT Authentication, CORS                     │  │
│  │                                                            │  │
│  │          http://localhost:3001                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            │ SQL over HTTP                       │
│                            │ (Neon Serverless)                   │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Neon PostgreSQL Database                        │
│                      (Cloud Hosted)                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tables:                                                  │  │
│  │  ├─ users            (Admin authentication)              │  │
│  │  ├─ site_content     (All page content)                  │  │
│  │  └─ events           (School events)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│          Pooled Connection over TLS                             │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

### Public Page Load
```
Browser
  │
  ├─→ Load React App
  │
  ├─→ GET /api/content
  │      │
  │      └─→ Backend → Query DB → Return JSON
  │
  └─→ Render Page with Content
```

### Admin Login
```
Admin enters credentials
  │
  ├─→ POST /api/auth/login
  │      │
  │      ├─→ Backend validates credentials
  │      │
  │      ├─→ Query users table
  │      │
  │      ├─→ Compare password hash
  │      │
  │      └─→ Generate JWT token
  │
  ├─→ Store token in localStorage
  │
  └─→ Redirect to Admin Panel
```

### Content Update
```
Admin edits content
  │
  ├─→ PUT /api/content/:key
  │      │
  │      ├─→ Verify JWT token (middleware)
  │      │
  │      ├─→ Update site_content table
  │      │
  │      └─→ Return updated content
  │
  └─→ Update React state
```

## Data Flow Diagram

### Before (Client-Only)
```
React Component
       │
       ├─→ Context State (memory)
       │
       └─→ Lost on refresh ❌
```

### After (Full Stack)
```
React Component
       │
       ├─→ API Call
       │      │
       │      ├─→ Express Backend
       │      │      │
       │      │      ├─→ Neon Database
       │      │      │      │
       │      │      │      └─→ Persistent Storage ✅
       │      │      │
       │      │      └─→ Response
       │      │
       │      └─→ Update React State
       │
       └─→ Re-render UI
```

## Authentication Flow

```
┌──────────┐
│  Login   │
│  Page    │
└────┬─────┘
     │
     │ Submit Credentials
     │
     ▼
┌────────────────────┐
│  POST /api/auth/   │
│     login          │
└────┬───────────────┘
     │
     │ Validate
     │
     ▼
┌────────────────────┐         ┌─────────────┐
│  Check Database    │────────>│  users      │
│  (bcrypt compare)  │         │  table      │
└────┬───────────────┘         └─────────────┘
     │
     │ Valid?
     │
     ▼
┌────────────────────┐
│  Generate JWT      │
│  Token             │
└────┬───────────────┘
     │
     │ Return Token
     │
     ▼
┌────────────────────┐
│  Store in          │
│  localStorage      │
└────┬───────────────┘
     │
     │ Include in Headers
     │
     ▼
┌────────────────────┐
│  Protected API     │
│  Requests          │
└────────────────────┘
```

## Component Hierarchy

```
App.tsx
├── SkipNavigation
├── Header (public only)
│   └── Navigation Links
├── Main Content
│   ├── Public Routes
│   │   ├── HomePage
│   │   ├── AboutPage
│   │   ├── ProgramsPage
│   │   ├── AdmissionsPage
│   │   ├── ContactPage
│   │   ├── ResourcesPage
│   │   ├── AccessibilityStatementPage
│   │   └── LoginPage
│   │
│   └── Protected Routes (AdminDashboard)
│       ├── DashboardOverview
│       ├── ManageHomePage
│       ├── ManageAboutPage
│       ├── ManageProgramsPage
│       ├── ManageAdmissionsPage
│       ├── ManageContactPage
│       └── ManageEventsPage
│
├── Footer (public only)
└── AccessibilityToolbar (always visible)
```

## Context Providers

```
index.tsx
└── React.StrictMode
    └── HashRouter
        └── AccessibilityProvider
            └── AuthProvider
                └── ContentProvider
                    └── App
```

## API Endpoints Structure

```
/api
├── /auth
│   ├── POST   /login      (Public)  - Login
│   └── GET    /verify     (Public)  - Verify token
│
├── /content
│   ├── GET    /           (Public)  - Get all content
│   ├── GET    /:key       (Public)  - Get specific content
│   └── PUT    /:key       (Auth)    - Update content
│
└── /events
    ├── GET    /           (Public)  - Get all events
    ├── GET    /:id        (Public)  - Get event by ID
    ├── POST   /           (Auth)    - Create event
    ├── PUT    /:id        (Auth)    - Update event
    └── DELETE /:id        (Auth)    - Delete event
```

## Database Schema

```sql
┌─────────────────────────────────────────────────┐
│                   users                         │
├─────────────────────────────────────────────────┤
│ id              SERIAL PRIMARY KEY              │
│ email           VARCHAR(255) UNIQUE NOT NULL    │
│ password_hash   VARCHAR(255) NOT NULL           │
│ name            VARCHAR(255)                    │
│ created_at      TIMESTAMP DEFAULT NOW()         │
│ updated_at      TIMESTAMP DEFAULT NOW()         │
└─────────────────────────────────────────────────┘
                    │
                    │ updated_by FK
                    ▼
┌─────────────────────────────────────────────────┐
│                site_content                     │
├─────────────────────────────────────────────────┤
│ id              SERIAL PRIMARY KEY              │
│ content_key     VARCHAR(50) UNIQUE NOT NULL     │
│ content_data    JSONB NOT NULL                  │
│ updated_by      INTEGER REFERENCES users(id)    │
│ created_at      TIMESTAMP DEFAULT NOW()         │
│ updated_at      TIMESTAMP DEFAULT NOW()         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│                   events                        │
├─────────────────────────────────────────────────┤
│ id              SERIAL PRIMARY KEY              │
│ title           VARCHAR(255) NOT NULL           │
│ event_date      DATE NOT NULL                   │
│ description     TEXT                            │
│ images          JSONB DEFAULT '[]'              │
│ created_at      TIMESTAMP DEFAULT NOW()         │
│ updated_at      TIMESTAMP DEFAULT NOW()         │
└─────────────────────────────────────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────┐
│           Presentation Layer                │
│                                             │
│  React 19 + TypeScript + Tailwind CSS      │
│  React Router + Context API                 │
└─────────────────┬───────────────────────────┘
                  │
                  │ HTTP/REST
                  │
┌─────────────────▼───────────────────────────┐
│           Application Layer                 │
│                                             │
│  Express.js + TypeScript                    │
│  JWT Authentication + bcrypt                │
│  Zod Validation + CORS                      │
└─────────────────┬───────────────────────────┘
                  │
                  │ SQL over HTTP
                  │
┌─────────────────▼───────────────────────────┐
│             Data Layer                      │
│                                             │
│  Neon PostgreSQL (Serverless)               │
│  @neondatabase/serverless driver            │
│  Connection Pooling + TLS                   │
└─────────────────────────────────────────────┘
```

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Frontend: Vercel / Netlify                    │
│  https://csi-manakkala.vercel.app              │
│                                                 │
└────────────────────┬────────────────────────────┘
                     │
                     │ HTTPS + JWT
                     │
┌────────────────────▼────────────────────────────┐
│                                                 │
│  Backend: Railway / Render                     │
│  https://api.csi-manakkala.com                 │
│                                                 │
└────────────────────┬────────────────────────────┘
                     │
                     │ Pooled Connection
                     │
┌────────────────────▼────────────────────────────┐
│                                                 │
│  Database: Neon (Already Cloud)                │
│  ep-xxx-pooler.region.aws.neon.tech           │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────┐
│  1. HTTPS/TLS                                   │
│     └─ All traffic encrypted                    │
└─────────────────────────────────────────────────┘
                     │
┌─────────────────────▼───────────────────────────┐
│  2. CORS                                        │
│     └─ Only allowed origins                     │
└─────────────────────────────────────────────────┘
                     │
┌─────────────────────▼───────────────────────────┐
│  3. JWT Authentication                          │
│     └─ Protected endpoints                      │
└─────────────────────────────────────────────────┘
                     │
┌─────────────────────▼───────────────────────────┐
│  4. Password Hashing                            │
│     └─ bcrypt with salt                         │
└─────────────────────────────────────────────────┘
                     │
┌─────────────────────▼───────────────────────────┐
│  5. Parameterized Queries                       │
│     └─ SQL injection prevention                 │
└─────────────────────────────────────────────────┘
                     │
┌─────────────────────▼───────────────────────────┐
│  6. Environment Variables                       │
│     └─ Secrets never in code                    │
└─────────────────────────────────────────────────┘
```

## State Management Flow

```
User Action
    │
    ▼
React Component
    │
    ├─→ Local State (UI)
    │
    ├─→ Context State (Global)
    │   ├─ AuthContext (user, token)
    │   ├─ ContentContext (pages, events)
    │   └─ AccessibilityContext (preferences)
    │
    └─→ API Call
        │
        ▼
    Backend API
        │
        ▼
    Neon Database
        │
        ▼
    Response
        │
        ▼
    Update Context
        │
        ▼
    Re-render Components
```

This architecture provides:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Security
- ✅ Maintainability
- ✅ Testability

For implementation details, see:
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development workflow
- [server/README.md](./server/README.md) - API documentation
- [SETUP.md](./SETUP.md) - Setup instructions


