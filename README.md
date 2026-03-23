# C.S.I. Higher Secondary School For The Partially Hearing, Manakala

This is the official web application for C.S.I. HSS Manakala, built with a decoupled Next.js frontend and Node.js/Express backend.

## Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend:** Node.js, Express, TypeScript
- **Database:** Neon Serverless PostgreSQL
- **Storage:** Backblaze B2 (media uploads); Vercel Blob (e.g. site logo)

## Project Structure
- `/client` - Next.js frontend application
- `/server` - Express backend API
- `/docs` - product, design, and migration notes

## Getting Started

### Prerequisites
- Node.js 20+
- A Neon PostgreSQL Database
- Backblaze B2 Bucket

### Installation
Run the following command from the root directory to install dependencies for both client and server:
```bash
npm run install:all
```

### Environment Variables
Create a root `.env` or `.env.local` file for backend secrets:
```env
PORT=5000
DATABASE_URL=your_neon_db_connection_string
JWT_SECRET=your_secure_jwt_secret
B2_APPLICATION_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_key
B2_BUCKET_ID=your_b2_bucket_id
B2_BUCKET_NAME=your_b2_bucket_name
```

Optional, for syncing images from Vercel Blob to the repo (list/download/upload via CLI and script):
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx
```
See [Vercel Blob – list, upload, download](./docs/VERCEL_BLOB.md).

If the frontend needs a non-default API origin, create `client/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### Running Locally
To start both the Next.js frontend and Express backend concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:3000` (or 3001/3002 depending on availability)
- Backend: `http://localhost:5000`

### Database Notes
- The current live API still expects legacy tables such as `users`, `events`, `inquiries`, and `page_content`.
- The Drizzle schema under `server/src/db/schema.ts` and `server/drizzle/` is a future `tbl_*` schema and is not yet the runtime contract for the active API.
- `npm run migrate` is intentionally not a live-schema setup path in this stabilization branch.

## Documentation
- [Product Requirements (docs/PRD.md)](./docs/PRD.md)
- [Design Guidelines (docs/DESIGN.md)](./docs/DESIGN.md)
- [Tech Stack (docs/TECHSTACK.md)](./docs/TECHSTACK.md)
- [Migration Plan (docs/MIGRATION_PLAN.md)](./docs/MIGRATION_PLAN.md)
