# 🔐 Your Neon Database Credentials

**IMPORTANT**: Keep this file private! Never commit it to git.

## Step 1: Get Your Neon Connection String

1. Visit [https://console.neon.tech](https://console.neon.tech)
2. Sign up or login
3. Create a new project:
   - Project name: `csi-manakkala-school` (or any name you like)
   - Region: Choose the closest to you
   - PostgreSQL version: Latest
4. Click "Create Project"
5. On the dashboard, click the **"Connect"** button
6. Make sure **"Pooled connection"** is selected
7. Copy the connection string

## Step 2: Your Connection String

Paste your Neon connection string here:

```
DATABASE_URL=postgresql://[YOUR_USERNAME]:[YOUR_PASSWORD]@ep-[PROJECT_ID]-pooler.[REGION].aws.neon.tech/[DATABASE_NAME]?sslmode=require
```

Example:
```
DATABASE_URL=postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Step 3: Add to Backend .env File

1. Navigate to `server/` directory
2. Copy `env.example` to `.env`
3. Replace the `DATABASE_URL` value with your connection string above
4. Save the file

## Quick Setup Command

Or use the automated setup script:

```bash
./setup.sh
```

This will prompt you for the connection string and configure everything automatically!

## Need Help?

- **Neon Docs**: https://neon.tech/docs
- **Connection Guide**: https://neon.tech/docs/connect/connect-from-any-app
- **Troubleshooting**: See SETUP.md

## Security Notes

✅ Your connection string is already secured with:
- TLS encryption (`?sslmode=require`)
- Password authentication
- Pooled connections for better performance

❌ Never:
- Share this file publicly
- Commit `.env` files to git
- Use the same password in multiple places

---

Once you've added your connection string, you're ready to run:

```bash
cd server
npm run migrate
npm run dev
```

Then start the frontend in another terminal:

```bash
npm run dev
```

Visit http://localhost:3000 and login with:
- Email: `admin@csihssmanakala.edu`
- Password: `password123`

🎉 Happy coding!

