# 🛠️ Development Workflow

This guide explains how to work with the CSI Manakkala website during development.

## Daily Development Workflow

### Starting Your Work Day

1. **Start the backend** (Terminal 1):
   ```bash
   cd server
   npm run dev
   ```
   ✅ Backend runs on `http://localhost:3001`

2. **Start the frontend** (Terminal 2):
   ```bash
   npm run dev
   ```
   ✅ Frontend runs on `http://localhost:3000`

3. **Open your browser**:
   - Visit http://localhost:3000
   - Login with admin credentials
   - Start developing!

### Making Changes

#### Frontend Changes
- Edit files in `src/`, `components/`, `pages/`, `context/`, etc.
- Changes hot-reload automatically
- Check browser console (F12) for errors

#### Backend Changes
- Edit files in `server/src/`
- Changes auto-reload with `tsx watch`
- Check terminal for errors

#### Database Schema Changes
- Edit `server/src/db/schema.sql`
- Run migrations: `cd server && npm run migrate`
- **Warning**: This will recreate tables

## Project Structure

```
csi_hss_manakkala_react_webapp/
├── components/          # Reusable React components
├── context/            # React Context providers (Auth, Content, Accessibility)
├── pages/              # Page components
│   ├── admin/         # Admin panel pages
│   └── ...            # Public pages
├── hooks/              # Custom React hooks
├── lib/               # API client
├── server/            # Backend API
│   ├── src/
│   │   ├── db/       # Database client and migrations
│   │   ├── routes/   # API endpoints
│   │   └── middleware/ # Auth middleware
│   └── package.json
├── types.ts           # TypeScript type definitions
└── package.json       # Frontend dependencies
```

## Common Development Tasks

### 1. Add a New Page

**Frontend:**
1. Create component in `pages/NewPage.tsx`
2. Add route in `App.tsx`
3. Add navigation link in `Header.tsx`

**Backend (if needed):**
1. Create route in `server/src/routes/`
2. Register route in `server/src/index.ts`
3. Update API client in `lib/api.ts`

### 2. Modify Database Schema

1. Edit `server/src/db/schema.sql`
2. Run migrations:
   ```bash
   cd server
   npm run migrate
   ```
3. Update TypeScript types in `types.ts` if needed

### 3. Add New API Endpoint

1. Create or edit route file in `server/src/routes/`
2. Add endpoint logic
3. Update `lib/api.ts` to call new endpoint
4. Use in React component

Example:
```typescript
// server/src/routes/myroute.ts
router.get('/example', async (req, res) => {
  const data = await sql`SELECT * FROM table`;
  res.json(data);
});

// lib/api.ts
export const myAPI = {
  async getExample() {
    return fetchWithAuth('/myroute/example');
  }
};

// Component
const { data } = await myAPI.getExample();
```

### 4. Update Content Types

1. Edit types in `types.ts`
2. Update database schema if needed
3. Update components using those types
4. Restart TypeScript server if needed

### 5. Test Admin Features

1. Login at http://localhost:3000/login
   - Email: `admin@csihssmanakala.edu`
   - Password: `password123`
2. Navigate to Admin Panel
3. Test content editing
4. Check database to verify changes persisted

## Testing Checklist

Before committing changes:

- [ ] Frontend starts without errors
- [ ] Backend starts without errors
- [ ] No console errors in browser
- [ ] Login works
- [ ] Content updates save to database
- [ ] Changes persist after refresh
- [ ] Public pages display correctly
- [ ] Admin pages require authentication
- [ ] Mobile responsive (test in DevTools)
- [ ] Accessibility features work

## Debugging Tips

### Frontend Issues

**Check Browser Console (F12)**
```javascript
// Look for errors in Console tab
// Check Network tab for failed API calls
// Use React DevTools for component state
```

**Common Issues:**
- API endpoint typo → Check `lib/api.ts`
- CORS error → Verify backend is running
- Auth error → Check token in localStorage
- Type error → Update `types.ts`

### Backend Issues

**Check Terminal Output**
```bash
# Look for error messages
# Check which port server is running on
# Verify database connection
```

**Common Issues:**
- Port already in use → Kill process or change port
- Database connection error → Check `DATABASE_URL` in `.env`
- JWT error → Verify `JWT_SECRET` is set
- Migration fails → Check SQL syntax

### Database Issues

**Connect to Neon Console**
1. Go to https://console.neon.tech
2. Select your project
3. Click "SQL Editor"
4. Run queries to check data

**Useful Queries:**
```sql
-- Check all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- View content
SELECT * FROM site_content;

-- View events
SELECT * FROM events;

-- View users
SELECT id, email, name FROM users;
```

## Environment Variables

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (`server/.env`)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "Add my feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

**Never commit:**
- `.env` files
- `.env.local` files
- `node_modules/`
- `dist/` build folders
- Database credentials

## Performance Tips

### Frontend
- Use React DevTools Profiler
- Lazy load images
- Memoize expensive computations
- Use `React.memo` for static components

### Backend
- Use connection pooling (already configured)
- Add database indexes for frequent queries
- Implement caching for static content
- Monitor Neon dashboard for query performance

## Deployment Preparation

Before deploying:

1. **Update Environment Variables**
   - Change `DATABASE_URL` to production
   - Generate strong `JWT_SECRET`
   - Update `FRONTEND_URL` and `VITE_API_URL`

2. **Security Checklist**
   - Change default admin password
   - Enable HTTPS
   - Set strong JWT secret
   - Review CORS settings

3. **Build and Test**
   ```bash
   # Frontend
   npm run build
   
   # Backend
   cd server
   npm run build
   ```

4. **Deploy**
   - Frontend → Vercel/Netlify
   - Backend → Railway/Render
   - Database → Already on Neon!

## Useful Commands

```bash
# Install dependencies
npm install                    # Frontend
cd server && npm install      # Backend

# Development
npm run dev                    # Frontend dev server
cd server && npm run dev      # Backend dev server

# Database
cd server && npm run migrate  # Run migrations

# Build
npm run build                  # Frontend production build
cd server && npm run build    # Backend production build

# Start production
npm run preview               # Frontend preview
cd server && npm start        # Backend production
```

## Need Help?

- **Setup Issues**: See [SETUP.md](./SETUP.md)
- **API Docs**: See [server/README.md](./server/README.md)
- **Quick Start**: See [QUICKSTART.md](./QUICKSTART.md)
- **Neon Docs**: https://neon.tech/docs

## Best Practices

1. **Write Descriptive Commits**
   - ✅ "Add event deletion feature to admin panel"
   - ❌ "Update files"

2. **Test Before Committing**
   - Run the app
   - Check for errors
   - Test main features

3. **Keep Code Clean**
   - Use TypeScript types
   - Follow existing patterns
   - Comment complex logic

4. **Handle Errors**
   - Add try-catch blocks
   - Show user-friendly messages
   - Log errors for debugging

5. **Security First**
   - Never commit secrets
   - Validate user input
   - Use parameterized queries
   - Implement proper authentication

Happy developing! 🚀


