import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { config } from 'dotenv';
import { testConnection, getPoolStats } from './db/pool.js'; // Using connection pool
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import eventsRoutes from './routes/events.js';
import uploadRoutes from './routes/upload.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

// Enable compression for all responses
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Balanced compression level
}));

app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    const poolStats = getPoolStats();
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: {
        pool: poolStats,
        connected: poolStats.total > 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Health check failed' 
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
  try {
    // Test database connection first
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth/login`);
      console.log(`📄 Content endpoint: http://localhost:${PORT}/api/content`);
      console.log(`📅 Events endpoint: http://localhost:${PORT}/api/events`);
      console.log(`📤 Upload endpoint: http://localhost:${PORT}/api/upload`);
      console.log(`\n✅ Frontend allowed from: ${FRONTEND_URL}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

