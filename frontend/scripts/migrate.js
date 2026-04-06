#!/usr/bin/env node

/**
 * Production-safe migration script that runs without tsx
 * This script is designed to run during deployment builds
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Running database migrations...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');

// In local development, load .env files if DATABASE_URL is not already set
if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production') {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envFallback = path.join(__dirname, '..', '.env');
    
    if (fs.existsSync(envPath)) {
      console.log('📄 Loading environment from .env.local');
      require('dotenv').config({ path: envPath });
    } else if (fs.existsSync(envFallback)) {
      console.log('📄 Loading environment from .env');
      require('dotenv').config({ path: envFallback });
    }
  } catch (error) {
    console.warn('⚠️  Could not load .env file:', error.message);
  }
}

try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.error('💡 Make sure DATABASE_URL is configured in your environment');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL is configured');
  
  // Run the TypeScript migration file using tsx (available in node_modules during build)
  const migrationScript = path.join(__dirname, '..', 'src', 'db', 'migrate.ts');
  const tsxPath = path.join(__dirname, '..', 'node_modules', '.bin', 'tsx');
  
  console.log('⏳ Executing migrations...');
  execSync(`node ${tsxPath} ${migrationScript}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    env: process.env
  });
  
  console.log('✅ Database migrations completed successfully');
  process.exit(0);
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  
  // In production, we might want to fail the build if migrations fail
  if (process.env.NODE_ENV === 'production') {
    console.error('⚠️  Build will fail due to migration error');
    process.exit(1);
  } else {
    console.warn('⚠️  Migration failed in non-production environment');
    process.exit(0);
  }
}
