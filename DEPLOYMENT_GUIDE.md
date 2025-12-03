# 🚀 Deployment Guide - CSI HSS Manakkala Web App

## 🚨 Current Issue: CORS Error in Production

### Problem:
- Frontend is deployed to: `https://csi-hss-manakkala-react-webapp.vercel.app`
- Backend is NOT deployed (still on `localhost:3001`)
- API calls are failing with CORS errors

### Solution:
You need to deploy the backend AND configure environment variables.

---

## 📋 Prerequisites

- ✅ Frontend deployed to Vercel
- ❌ Backend needs to be deployed
- ❌ Environment variables need to be configured

---

## 🔧 Step-by-Step Deployment

### 1️⃣ Deploy the Backend

You have several options for deploying the Express backend:

#### **Option A: Vercel (Recommended - Same Platform)**

1. Create a `vercel.json` in the `server/` directory
2. Deploy the backend to Vercel
3. It will get a URL like: `https://your-backend.vercel.app`

#### **Option B: Railway (Easy Database Integration)**

1. Connect Railway to your GitHub repo
2. Railway will auto-detect Node.js
3. Set environment variables
4. Deploy

#### **Option C: Render (Free Tier Available)**

1. Create a new Web Service on Render
2. Connect your GitHub repo
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`

#### **Option D: Heroku**

1. Install Heroku CLI
2. Create new app: `heroku create your-app-name`
3. Deploy: `git push heroku main`

---

## 🌐 Recommended: Deploy Backend to Vercel

### Step 1: Create `vercel.json` in server directory

Create `/server/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 2: Update `server/package.json`

Add Vercel build script:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "vercel-build": "tsc"
  }
}
```

### Step 3: Deploy Backend to Vercel

```bash
# Navigate to server directory
cd server

# Deploy to Vercel
vercel

# Follow prompts:
# - Set project name: csi-hss-manakkala-api
# - Link to existing project or create new
```

You'll get a URL like: `https://csi-hss-manakkala-api.vercel.app`

---

## 🔑 Step 2: Set Environment Variables

### Backend (Vercel Dashboard)

Go to your backend project on Vercel → Settings → Environment Variables

Add these variables:

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_srdp6ZlycJv2@ep-shiny-cloud-a17zij3s-pooler.ap-southeast-1.aws.neon.tech/csi_hss_manakkala?sslmode=require

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=production

# Port
PORT=3001

# Frontend URL (your Vercel frontend)
FRONTEND_URL=https://csi-hss-manakkala-react-webapp.vercel.app

# Backblaze B2 Credentials
B2_APPLICATION_KEY_ID=4c6b021b5a16
B2_APPLICATION_KEY=00375a2d3225788e08472bed0aec292c1e166269e1
B2_BUCKET_ID=e40ca6ab90e2e10b95aa0116
B2_BUCKET_NAME=csi-hss-manakkala
```

### Frontend (Vercel Dashboard)

Go to your frontend project on Vercel → Settings → Environment Variables

Add this variable:

```env
# Your deployed backend URL
VITE_API_URL=https://csi-hss-manakkala-api.vercel.app/api
```

**⚠️ Important:** After adding environment variables, you MUST redeploy both frontend and backend!

---

## 🔄 Step 3: Redeploy Frontend

### Option 1: Vercel Dashboard
1. Go to your frontend project
2. Click "Deployments" tab
3. Find latest deployment
4. Click "..." → "Redeploy"

### Option 2: Git Push
```bash
git add .
git commit -m "Update environment variables"
git push
```

Vercel will auto-deploy on push.

---

## ✅ Step 4: Verify Deployment

### Test Backend Health:
```bash
curl https://your-backend-url.vercel.app/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-12-03T...",
  "database": {
    "pool": { ... },
    "connected": true
  }
}
```

### Test Frontend:
1. Open: `https://csi-hss-manakkala-react-webapp.vercel.app`
2. Open browser console (F12)
3. Check for errors
4. Try logging in

---

## 🐛 Troubleshooting

### CORS Errors Still Appearing?

**Check:**
1. ✅ Backend environment variable `FRONTEND_URL` is set correctly
2. ✅ Frontend environment variable `VITE_API_URL` is set correctly
3. ✅ Both apps redeployed after setting variables
4. ✅ Check browser console for actual API URL being called

**The CORS configuration has been updated to allow:**
- `http://localhost:3000` (Development)
- `http://localhost:5173` (Vite Dev Server)
- `https://csi-hss-manakkala-react-webapp.vercel.app` (Production)

### Database Connection Errors?

**Check:**
1. ✅ `DATABASE_URL` is set in backend environment variables
2. ✅ Neon database is active (not paused)
3. ✅ Connection string includes `sslmode=require`

### Images Not Loading?

**Check:**
1. ✅ B2 credentials are set in backend environment variables
2. ✅ B2 bucket is accessible
3. ✅ Authorization tokens are being generated

---

## 📝 Quick Deployment Checklist

### Backend:
- [ ] Create `vercel.json` in `server/` directory
- [ ] Deploy backend to Vercel (or other platform)
- [ ] Set all environment variables in Vercel dashboard
- [ ] Test `/health` endpoint
- [ ] Verify database connection

### Frontend:
- [ ] Set `VITE_API_URL` environment variable in Vercel
- [ ] Redeploy frontend
- [ ] Test login functionality
- [ ] Verify API calls in browser console

---

## 🎯 Expected URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | `https://csi-hss-manakkala-react-webapp.vercel.app` |
| Backend | `https://csi-hss-manakkala-api.vercel.app` (to be deployed) |
| Database | `ep-shiny-cloud-a17zij3s-pooler.ap-southeast-1.aws.neon.tech` |
| Storage | `s3.eu-central-003.backblazeb2.com` |

---

## 🔒 Security Reminders

After deployment:

1. **Change Admin Password**
   - Default: `admin@csihssmanakala.edu` / `password123`
   - Change immediately!

2. **Rotate JWT Secret**
   - Generate a strong random string
   - Update in Vercel environment variables

3. **Enable HTTPS Only**
   - Vercel provides this by default

4. **Monitor Database Access**
   - Check Neon dashboard regularly

---

## 🚀 Alternative: Quick Deploy Script

If you want to use CLI for deployment:

```bash
# Deploy Backend
cd server
vercel --prod

# Deploy Frontend (if needed)
cd ..
vercel --prod
```

---

## 📞 Need Help?

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Test backend `/health` endpoint directly
4. Verify all environment variables are set
5. Ensure both apps are redeployed after config changes

---

## ✨ Next Steps After Successful Deployment

1. ✅ Test all pages on production URL
2. ✅ Test admin login
3. ✅ Test image uploads
4. ✅ Test content updates
5. ✅ Change default admin password
6. ✅ Set up custom domain (optional)
7. ✅ Enable monitoring/analytics

---

**Remember:** Environment variables require a redeploy to take effect! 🔄

