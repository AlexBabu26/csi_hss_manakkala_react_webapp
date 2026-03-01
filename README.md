# C.S.I. Higher Secondary School For The Partially Hearing, Manakala

This is the official web application for C.S.I. HSS Manakala, built with a decoupled Next.js frontend and Node.js/Express backend.

## Tech Stack
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4
- **Backend:** Node.js, Express, TypeScript
- **Database:** Neon Serverless PostgreSQL
- **Storage:** Backblaze B2

## Project Structure
- `/client` - Next.js frontend application
- `/server` - Express backend API
- `vercel.json` - Vercel deployment configuration

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
Create a `.env` file in the `/server` directory:
```env
PORT=5000
DATABASE_URL=your_neon_db_connection_string
JWT_SECRET=your_secure_jwt_secret
B2_APPLICATION_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_key
B2_BUCKET_ID=your_b2_bucket_id
B2_BUCKET_NAME=your_b2_bucket_name
```

### Running Locally
To start both the Next.js frontend and Express backend concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:3000` (or 3001/3002 depending on availability)
- Backend: `http://localhost:5000`

### Database Migration
To initialize the database schema:
```bash
cd server
npm run migrate
```

## Documentation
- [Product Requirements (PRD.md)](./PRD.md)
- [Design Guidelines (DESIGN.md)](./DESIGN.md)
- [Tech Stack (TECHSTACK.md)](./TECHSTACK.md)
- [Migration Plan (MIGRATION_PLAN.md)](./MIGRATION_PLAN.md)
