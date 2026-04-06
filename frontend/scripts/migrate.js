#!/usr/bin/env node

/**
 * Production-safe migration script that runs without tsx
 * This script is designed to run during deployment builds
 * 
 * It handles the case where tables were created with db:push
 * and need to be marked as migrated before running new migrations
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
  
  const tsxPath = path.join(__dirname, '..', 'node_modules', '.bin', 'tsx');
  const cwd = path.join(__dirname, '..');
  
  // First, try to mark existing migrations as complete (for db:push -> migrations transition)
  console.log('🔍 Checking if migration tracking needs initialization...');
  try {
    const markCompleteScript = path.join(__dirname, '..', 'src', 'db', 'mark-migrations-complete.ts');
    execSync(`node ${tsxPath} ${markCompleteScript}`, {
      stdio: 'pipe',
      cwd: cwd,
      env: process.env
    });
    console.log('✅ Migration tracking initialized');
  } catch (markError) {
    // If marking fails, it might mean migrations are already tracked, which is fine
    const errorOutput = markError.stderr ? markError.stderr.toString() : '';
    if (errorOutput.includes('already exists') || errorOutput.includes('duplicate key')) {
      console.log('✅ Migration tracking already initialized');
    } else {
      console.log('ℹ️  Skipping migration tracking initialization (may already be set up)');
    }
  }
  
  // Now run regular migrations
  const migrationScript = path.join(__dirname, '..', 'src', 'db', 'migrate.ts');
  console.log('⏳ Running migrations...');
  execSync(`node ${tsxPath} ${migrationScript}`, {
    stdio: 'inherit',
    cwd: cwd,
    env: process.env
  });
  
  console.log('✅ Database migrations completed successfully');
  process.exit(0);
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  
  // Check if the error is about tables already existing
  const errorStr = error.toString();
  if (errorStr.includes('already exists') || errorStr.includes('42P07')) {
    console.error('');
    console.error('💡 It looks like your database was created with db:push.');
    console.error('   Please run: npm run db:mark-complete');
    console.error('   Then redeploy.');
  }
  
  // In production, we might want to fail the build if migrations fail
  if (process.env.NODE_ENV === 'production') {
    console.error('⚠️  Build will fail due to migration error');
    process.exit(1);
  } else {
    console.warn('⚠️  Migration failed in non-production environment');
    process.exit(0);
  }
}
