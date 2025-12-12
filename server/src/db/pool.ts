import { Pool } from 'pg';
import { config } from 'dotenv';

config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Please add it to your .env file');
}

// Create a connection pool with optimized settings for Neon
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
  // Connection pool configuration
  max: 20, // Maximum number of clients in the pool
  min: 2, // Minimum number of clients to keep
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Timeout for acquiring connection (10 seconds)
  maxUses: 7500, // Recycle connection after 7500 uses (Neon recommendation)
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Closing database pool...');
  await pool.end();
  console.log('✅ Database pool closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Closing database pool...');
  await pool.end();
  console.log('✅ Database pool closed');
  process.exit(0);
});

// SQL template tag helper for type safety and security
export async function sql(strings: TemplateStringsArray, ...values: any[]) {
  const text = strings.reduce((query, str, i) => {
    return query + str + (i < values.length ? `$${i + 1}` : '');
  }, '');
  
  try {
    const result = await pool.query(text, values);
    return result.rows;
  } catch (error) {
    console.error('❌ SQL Query Error:', error);
    console.error('Query:', text);
    console.error('Values:', values);
    throw error;
  }
}

// Test the connection pool
export async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version()');
    console.log('✅ Database connected successfully at:', result.rows[0].current_time);
    console.log('📊 Pool status:', {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
    });
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Helper to get pool stats (useful for monitoring)
export function getPoolStats() {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  };
}




