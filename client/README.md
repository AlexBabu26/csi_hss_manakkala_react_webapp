This is the Next.js frontend for the CSI HSS Manakala web application.

## Getting Started

Install dependencies and run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The frontend talks to the Express backend through `NEXT_PUBLIC_API_BASE_URL`. If you need to override the default local API origin, create `client/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

The admin login now uses the live backend auth endpoint. Public pages and accessibility tooling live under `client/src/app`, `client/src/components`, and `client/src/contexts`.
