# ✅ Getting Started Checklist

Use this checklist to set up your CSI Manakkala website with Neon database.

## 📋 Pre-Setup

- [ ] Node.js installed (check: `node --version`)
- [ ] npm installed (check: `npm --version`)
- [ ] Git installed (optional, for version control)
- [ ] Code editor ready (VS Code, Cursor, etc.)

## 🔐 Step 1: Get Neon Database

- [ ] Go to [https://console.neon.tech](https://console.neon.tech)
- [ ] Sign up for free account
- [ ] Create new project named "csi-manakkala-school"
- [ ] Click "Connect" button
- [ ] Select "Pooled connection"
- [ ] Copy your connection string
- [ ] Save it somewhere safe (you'll need it next)

**Your connection string should look like:**
```
postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require
```

## ⚙️ Step 2: Backend Setup

- [ ] Open terminal in project root
- [ ] Run: `cd server`
- [ ] Run: `npm install`
- [ ] Run: `cp env.example .env`
- [ ] Open `server/.env` in your editor
- [ ] Paste your Neon connection string as `DATABASE_URL`
- [ ] Save the file
- [ ] Run: `npm run migrate`
- [ ] Wait for "✅ Migration completed successfully!"
- [ ] Run: `npm run dev`
- [ ] Verify server runs on `http://localhost:3001`
- [ ] Keep this terminal window open

## 🎨 Step 3: Frontend Setup

- [ ] Open a NEW terminal window
- [ ] Navigate to project root (not in `server/`)
- [ ] Run: `npm install`
- [ ] Run: `cp env.local.example .env.local`
- [ ] Open `.env.local` (verify it has `VITE_API_URL=http://localhost:3001/api`)
- [ ] Run: `npm run dev`
- [ ] Wait for "Local: http://localhost:3000"
- [ ] Keep this terminal window open too

## 🌐 Step 4: Test the Application

- [ ] Open browser to [http://localhost:3000](http://localhost:3000)
- [ ] Verify home page loads
- [ ] Click through navigation links (About, Programs, etc.)
- [ ] Click "Login" in header
- [ ] Login with:
  - Email: `admin@csihssmanakala.edu`
  - Password: `password123`
- [ ] Verify redirect to Admin Panel
- [ ] Click "Home Page" in admin sidebar
- [ ] Make a small change to any field
- [ ] Click "Save Changes"
- [ ] Verify success message appears
- [ ] Navigate back to public home page
- [ ] Verify your change is visible
- [ ] Refresh the page (Ctrl+R / Cmd+R)
- [ ] Verify change persists after refresh ✅

## 🔒 Step 5: Security (Important!)

- [ ] Login to admin panel
- [ ] Change the default password (when user management is added)
- [ ] Generate strong JWT secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Replace `JWT_SECRET` in `server/.env` with generated secret
- [ ] Restart backend server
- [ ] Never commit `.env` or `.env.local` files to git

## 📝 Step 6: Customize Content

- [ ] Login to admin panel
- [ ] Update home page hero section
- [ ] Update about page mission and philosophy
- [ ] Add leadership team members
- [ ] Upload facility images
- [ ] Configure programs information
- [ ] Set up admissions FAQs
- [ ] Update contact information
- [ ] Create school events
- [ ] Upload event images

## 🚀 Optional: Version Control

- [ ] Run: `git init` (if not already a git repo)
- [ ] Create `.gitignore` with:
  ```
  node_modules/
  dist/
  .env
  .env.local
  server/.env
  ```
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial commit with Neon DB integration"`
- [ ] Create GitHub repository
- [ ] Push code: `git push origin main`

## 📚 Next Steps

- [ ] Read [DEVELOPMENT.md](./DEVELOPMENT.md) for development workflow
- [ ] Review [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
- [ ] Bookmark [server/README.md](./server/README.md) for API reference
- [ ] Plan your content strategy
- [ ] Consider deployment options (Vercel, Railway, Render)

## 🐛 Troubleshooting Checklist

### Backend won't start
- [ ] Verify `server/.env` exists
- [ ] Check `DATABASE_URL` is correct
- [ ] Ensure Neon database is accessible
- [ ] Check port 3001 is not in use
- [ ] Run `npm install` again in server directory

### Frontend won't start
- [ ] Verify `.env.local` exists
- [ ] Check `VITE_API_URL` is correct
- [ ] Ensure port 3000 is not in use
- [ ] Run `npm install` again in project root

### Login doesn't work
- [ ] Verify backend is running on port 3001
- [ ] Check browser console for errors
- [ ] Verify migrations ran successfully
- [ ] Check `server/.env` has correct `DATABASE_URL`
- [ ] Try restarting both servers

### Changes don't save
- [ ] Verify you're logged in
- [ ] Check backend terminal for errors
- [ ] Open browser DevTools Network tab
- [ ] Look for failed API requests
- [ ] Verify token is being sent (Authorization header)

### Database connection fails
- [ ] Verify connection string ends with `?sslmode=require`
- [ ] Check internet connection
- [ ] Verify Neon project is active
- [ ] Try copying connection string again from Neon console

## 📞 Getting Help

If you're stuck:
1. ✅ Check this checklist again
2. 📖 Read [SETUP.md](./SETUP.md) troubleshooting section
3. 🔍 Search error message in terminal/console
4. 💻 Check both terminal windows for errors
5. 🌐 Verify both servers are running
6. 🔄 Try restarting both servers
7. 🧹 Clear browser cache and try again

## ✨ Success Indicators

You're all set when:
- ✅ Both servers running without errors
- ✅ Can access website at localhost:3000
- ✅ Can login to admin panel
- ✅ Changes save to database
- ✅ Changes persist after page refresh
- ✅ No errors in browser console
- ✅ No errors in terminal windows

## 🎉 Congratulations!

Once all checkboxes are ticked, you have:
- ✅ A fully functional website
- ✅ Admin panel for content management
- ✅ Persistent database storage
- ✅ Secure authentication
- ✅ Professional development setup

Time to start customizing your content! 🚀

---

**Need quick help?**
- [QUICKSTART.md](./QUICKSTART.md) - 5-minute setup
- [SETUP.md](./SETUP.md) - Detailed instructions
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development workflow

**Happy building! 🏫**

