# CSI Manakkala School Website - Complete Setup Guide

This guide will help you set up the complete application with Neon PostgreSQL database.

## 🎯 What You'll Need

1. [Node.js](https://nodejs.org/) (v18 or higher)
2. A [Neon](https://neon.tech) account (free tier available)
3. Your Neon database connection string

## 📋 Step-by-Step Setup

### Step 1: Get Your Neon Database Connection String

1. **Create a Neon Account**
   - Go to [https://console.neon.tech](https://console.neon.tech)
   - Sign up for a free account

2. **Create a New Project**
   - Click "Create Project"
   - Choose a name (e.g., "csi-manakkala-school")
   - Select a region closest to you
   - Click "Create Project"

3. **Get Your Connection String**
   - On the project dashboard, click the **"Connect"** button
   - Make sure **"Pooled connection"** is selected
   - Copy the connection string that looks like:
     ```
     postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require
     ```

### Step 2: Backend Setup

1. **Navigate to Server Directory**
   ```bash
   cd server
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment File**
   ```bash
   cp env.example .env
   ```

4. **Edit .env File**
   
   Open `server/.env` and add your credentials:
   
   ```env
   # Paste your Neon connection string here
   DATABASE_URL=postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require
   
   # Generate a strong secret for JWT tokens
   JWT_SECRET=change-this-to-a-random-long-string
   
   # Server configuration
   PORT=3001
   NODE_ENV=development
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   ```

5. **Run Database Migrations**
   
   This creates all tables and inserts default data:
   
   ```bash
   npm run migrate
   ```
   
   You should see:
   ```
   ✅ Database connected successfully
   ✅ Migration completed successfully!
   ```

6. **Start the Backend Server**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:3001`

### Step 3: Frontend Setup

1. **Open a New Terminal** (keep backend running)

2. **Navigate to Project Root**
   ```bash
   cd ..  # If you're in the server directory
   ```

3. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

4. **Create Frontend Environment File**
   ```bash
   cp env.local.example .env.local
   ```

5. **Edit .env.local File**
   
   Open `.env.local` and verify:
   
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

6. **Start the Frontend**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:3000`

### Step 4: Access the Application

1. **Open Your Browser**
   - Go to [http://localhost:3000](http://localhost:3000)

2. **Login to Admin Panel**
   - Click "Login" in the header
   - Use these credentials:
     - **Email**: `admin@csihssmanakala.edu`
     - **Password**: `password123`

3. **Start Managing Content**
   - After login, click "Admin Panel"
   - You can now edit all website content
   - Changes are saved to your Neon database!

## 🎉 You're All Set!

Your application is now running with:
- ✅ Frontend on `http://localhost:3000`
- ✅ Backend API on `http://localhost:3001`
- ✅ Neon PostgreSQL database
- ✅ Persistent data storage

## 🔐 Security Notes

**⚠️ IMPORTANT FOR PRODUCTION:**

1. **Change the default admin password**
   - Login to the admin panel
   - Navigate to user settings (when implemented)
   - Change from `password123` to a strong password

2. **Update JWT_SECRET**
   - Generate a random string:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Replace `JWT_SECRET` in `server/.env`

3. **Update DATABASE_URL**
   - Never commit `.env` files to git
   - Use environment variables in production

## 🐛 Troubleshooting

### Backend Won't Start

**Error: "DATABASE_URL is not set"**
- Make sure `server/.env` exists
- Verify `DATABASE_URL` is in the file
- Check there are no typos

**Error: "Connection failed"**
- Verify your Neon connection string is correct
- Check your internet connection
- Ensure the connection string ends with `?sslmode=require`

### Frontend Can't Connect to Backend

**CORS errors in browser console**
- Make sure backend is running on port 3001
- Verify `FRONTEND_URL` in `server/.env` is `http://localhost:3000`
- Check `.env.local` has `VITE_API_URL=http://localhost:3001/api`

**Login doesn't work**
- Verify migrations ran successfully
- Check backend server logs for errors
- Try restarting both servers

### Database Migration Fails

**Connection timeout**
- Check your internet connection
- Verify the Neon connection string
- Try again after a few moments

**Tables already exist**
- This is normal if you've run migrations before
- The script uses `CREATE TABLE IF NOT EXISTS`
- Your data is safe

## 📚 Next Steps

1. **Customize Content**
   - Login to admin panel
   - Edit home page, about page, programs, etc.
   - Upload images
   - Create events

2. **Explore the API**
   - Visit `http://localhost:3001/health` for health check
   - Use Postman or similar to test endpoints
   - See `server/README.md` for API documentation

3. **Deploy to Production**
   - Use platforms like Vercel (frontend) and Railway/Render (backend)
   - Your Neon database works from anywhere
   - Update environment variables for production URLs

## 📖 Additional Resources

- **Neon Documentation**: [https://neon.tech/docs](https://neon.tech/docs)
- **Neon Connection Guide**: [https://neon.tech/docs/connect/connect-from-any-app](https://neon.tech/docs/connect/connect-from-any-app)
- **Backend API Docs**: See `server/README.md`
- **Frontend Docs**: See `README.md`

## 💡 Tips

- Keep both terminal windows open (one for backend, one for frontend)
- Backend changes require restart (or use `npm run dev` for auto-reload)
- Frontend changes hot-reload automatically
- Check browser console for frontend errors
- Check terminal for backend errors
- All content changes are automatically saved to the database

## 🆘 Need Help?

If you're stuck:
1. Check the terminal output for errors
2. Look at browser console (F12)
3. Verify all environment variables are set
4. Make sure both servers are running
5. Try restarting both servers

Happy coding! 🚀

