# 🔑 Environment Variables Setup Guide

## 📋 Quick Reference

### ⚠️ IMMEDIATE ACTION REQUIRED:

Your frontend is deployed to Vercel but **backend is still on localhost**. This is why you're getting CORS errors!

---

## 🚀 STEP 1: Deploy Backend to Vercel

### Quick Deploy Command:

```bash
# Navigate to server directory
cd server

# Deploy to Vercel
vercel --prod

# Note the URL you get (something like):
# https://csi-hss-manakkala-api.vercel.app
```

---

## 🔧 STEP 2: Set Backend Environment Variables

Go to: **Vercel Dashboard → Your Backend Project → Settings → Environment Variables**

Add these **EXACTLY** (copy-paste recommended):

```env
DATABASE_URL=postgresql://neondb_owner:npg_srdp6ZlycJv2@ep-shiny-cloud-a17zij3s-pooler.ap-southeast-1.aws.neon.tech/csi_hss_manakkala?sslmode=require

JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random-and-secure

NODE_ENV=production

PORT=3001

FRONTEND_URL=https://csi-hss-manakkala-react-webapp.vercel.app

B2_APPLICATION_KEY_ID=4c6b021b5a16

B2_APPLICATION_KEY=00375a2d3225788e08472bed0aec292c1e166269e1

B2_BUCKET_ID=e40ca6ab90e2e10b95aa0116

B2_BUCKET_NAME=csi-hss-manakkala
```

**⚠️ IMPORTANT:** After adding these, click "Redeploy" in Vercel!

---

## 🎨 STEP 3: Set Frontend Environment Variable

Go to: **Vercel Dashboard → Your Frontend Project → Settings → Environment Variables**

Add this ONE variable:

```env
VITE_API_URL=https://YOUR-BACKEND-URL.vercel.app/api
```

**Replace `YOUR-BACKEND-URL`** with the actual URL you got from Step 1!

Example:
```env
VITE_API_URL=https://csi-hss-manakkala-api.vercel.app/api
```

**⚠️ IMPORTANT:** After adding this, click "Redeploy" in Vercel!

---

## ✅ STEP 4: Verify Everything Works

### Test Backend Health:
```bash
curl https://YOUR-BACKEND-URL.vercel.app/health
```

Should return something like:
```json
{
  "status": "ok",
  "timestamp": "2025-12-03T...",
  "database": {
    "connected": true
  }
}
```

### Test Frontend:
1. Open: https://csi-hss-manakkala-react-webapp.vercel.app
2. Press F12 (open browser console)
3. Try to login:
   - Email: `admin@csihssmanakala.edu`
   - Password: `password123`
4. Check console for errors

---

## 🎯 Quick Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Backend redeployed after adding variables
- [ ] Frontend `VITE_API_URL` variable set
- [ ] Frontend redeployed after adding variable
- [ ] Tested `/health` endpoint
- [ ] Tested login on production site

---

## 🐛 Still Getting CORS Errors?

### Common Issues:

**1. Environment Variable Not Set Properly**
- Make sure `VITE_API_URL` in frontend has `/api` at the end
- Make sure you redeployed after setting variables

**2. Wrong API URL**
- Open browser console (F12) on your site
- Look at Network tab
- Check what URL is being called
- Should be: `https://YOUR-BACKEND-URL.vercel.app/api/...`
- Should NOT be: `http://localhost:3001/api/...`

**3. Backend Not Deployed**
- Backend MUST be deployed to a public URL
- Cannot be localhost

---

## 📱 Alternative: Use Railway for Backend

If Vercel serverless functions don't work well:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to server directory
cd server

# Initialize and deploy
railway init
railway up
```

Railway will give you a URL like: `https://your-app.railway.app`

Then set `VITE_API_URL=https://your-app.railway.app/api` in Vercel frontend.

---

## 🆘 Emergency Quick Fix

If you need a quick temporary fix while setting up proper deployment:

### Option 1: Use Vercel Dev (Not Recommended for Production)
```bash
cd server
vercel dev
```

### Option 2: Use ngrok (Temporary Testing Only)
```bash
# In one terminal - start backend
cd server
npm run dev

# In another terminal - expose it
ngrok http 3001

# Use the ngrok URL in Vercel frontend env var
VITE_API_URL=https://xyz123.ngrok.io/api
```

**⚠️ These are TEMPORARY solutions only!**

---

## 🔒 Security Notes

### After Deployment:

1. **Change JWT_SECRET**
   - Generate a strong random string (at least 32 characters)
   - Use: `openssl rand -hex 32`

2. **Change Admin Password**
   - Login with default credentials
   - Change password immediately

3. **Rotate B2 Keys Periodically**
   - Create new keys in Backblaze
   - Update in Vercel environment variables

---

## 📞 Support

If you're still stuck:

1. Check Vercel deployment logs (very helpful!)
2. Check browser console for actual API URL being called
3. Test backend `/health` endpoint directly
4. Make sure BOTH frontend and backend are redeployed after env var changes

---

## ✨ Final Notes

**The CORS fix is already in place!** The backend code has been updated to allow:
- ✅ `https://csi-hss-manakkala-react-webapp.vercel.app`
- ✅ `http://localhost:5173` (for local dev)
- ✅ `http://localhost:3000` (for local dev)

You just need to:
1. **Deploy the backend**
2. **Set environment variables**
3. **Redeploy both apps**

That's it! 🎉

