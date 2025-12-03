# CSI Manakkala School - Backend Server

Backend API server for the CSI HSS Manakkala website, built with Express.js and Neon PostgreSQL.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` and add your Neon database connection string:

```env
DATABASE_URL=postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
```

### 3. Get Your Neon Database Connection String

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Create a new project or select an existing one
3. Click **"Connect"** in your project dashboard
4. Copy the connection string (use the **pooled** connection for better performance)
5. Paste it into your `.env` file as `DATABASE_URL`

**Important**: Make sure your connection string includes `?sslmode=require` at the end.

### 4. Run Database Migrations

Initialize your database schema:

```bash
npm run migrate
```

This will create all necessary tables and insert default data including an admin user.

### 5. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Default Admin Credentials

After running migrations, you can login with:

- **Email**: `admin@csihssmanakala.edu`
- **Password**: `password123`

**⚠️ IMPORTANT**: Change this password immediately in production!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/verify` - Verify JWT token

### Content Management
- `GET /api/content` - Get all page content
- `GET /api/content/:key` - Get specific page content
- `PUT /api/content/:key` - Update page content (requires auth)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event (requires auth)
- `PUT /api/events/:id` - Update event (requires auth)
- `DELETE /api/events/:id` - Delete event (requires auth)

### Health Check
- `GET /health` - Server health status

## Database Schema

The database includes the following tables:

- **users** - Admin user authentication
- **site_content** - All page content stored as JSONB
- **events** - School events with images

## Production Deployment

### Environment Variables

Make sure to set these in production:

```env
DATABASE_URL=your-production-neon-url
JWT_SECRET=a-strong-secret-key
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Build and Run

```bash
npm run build
npm start
```

## Troubleshooting

### Connection Issues

If you see "DATABASE_URL is not set":
- Make sure you have a `.env` file in the `server/` directory
- Verify the `.env` file contains the `DATABASE_URL` variable
- Restart the server after changing `.env`

### Migration Errors

If migrations fail:
- Check your database connection string
- Ensure your Neon database is accessible
- Try running migrations again: `npm run migrate`

### CORS Errors

If the frontend can't connect:
- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Check that both frontend and backend are running
- Ensure the backend API URL in frontend matches (default: `http://localhost:3001/api`)

## Support

For more information about Neon database:
- [Neon Documentation](https://neon.tech/docs)
- [Connection Guide](https://neon.tech/docs/connect/connect-from-any-app)


