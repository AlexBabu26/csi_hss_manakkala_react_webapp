import { neon, neonConfig } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

// Enable connection pooling for better performance
neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Please add it to your .env file');
}

// Create the SQL client using Neon's serverless driver
// This works over HTTP and is perfect for serverless environments
export const sql = neon(process.env.DATABASE_URL);

// Test the connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connected successfully at:', result[0].current_time);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}


