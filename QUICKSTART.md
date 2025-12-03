# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js installed
- Neon account ([sign up free](https://console.neon.tech))

## Setup in 4 Commands

### 1️⃣ Get Your Neon Connection String

Visit [https://console.neon.tech](https://console.neon.tech), create a project, and copy your connection string (pooled).

### 2️⃣ Setup Backend

```bash
cd server
npm install
cp env.example .env
# Edit .env and paste your DATABASE_URL
npm run migrate
npm run dev
```

Keep this terminal open!

### 3️⃣ Setup Frontend (New Terminal)

```bash
npm install
cp env.local.example .env.local
npm run dev
```

### 4️⃣ Access the Site

- **Website**: http://localhost:3000
- **Admin Login**: 
  - Email: `admin@csihssmanakala.edu`
  - Password: `password123`

## That's It! 🎉

Your site is now running with a real database. All content changes are persisted!

## Next Steps

- Login and customize your content
- Upload images
- Add events
- Read [SETUP.md](./SETUP.md) for detailed docs

## Stuck?

Check [SETUP.md](./SETUP.md) for troubleshooting.


