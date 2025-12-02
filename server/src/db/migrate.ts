import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import { config } from 'dotenv';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigrations() {
  console.log('🔄 Starting database migration...');
  
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    // Connect to database
    await client.connect();
    console.log('✅ Database connected successfully');
    
    // Read and execute the schema file
    const schemaPath = join(__dirname, 'schema.sql');
    const schemaSQL = readFileSync(schemaPath, 'utf-8');
    
    console.log('📝 Executing database schema...');
    
    // Execute the entire schema
    await client.query(schemaSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('\n📊 Database is ready with all tbl_ prefixed tables!');
    console.log('\n🔐 Default Admin Credentials:');
    console.log('   Email: admin@csihssmanakala.edu');
    console.log('   Password: password123');
    console.log('\n🚀 Next Steps:');
    console.log('   1. Start the backend: npm run dev');
    console.log('   2. Start the frontend: cd .. && npm run dev');
    console.log('   3. Visit: http://localhost:3000');
    console.log('\n⚠️  Remember to change the default password in production!');
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await client.end();
    process.exit(1);
  }
}

runMigrations();

