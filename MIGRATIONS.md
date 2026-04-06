# Database Migration Guide

## What Changed

This PR adds automatic database migrations that run during the build process, ensuring the production database schema is always up-to-date.

## Key Changes

1. **Automatic Migrations on Build**: The `build` script now runs migrations before building
   ```json
   "build": "node scripts/migrate.js && next build"
   ```

2. **Production-Safe Migration Script**: Added `scripts/migrate.js` that:
   - Loads environment variables (in dev)
   - Validates `DATABASE_URL` is set
   - Runs Drizzle migrations
   - Fails the build if migrations fail in production

3. **Migration Files**: All migrations in `drizzle/` folder are tracked and applied sequentially

## Deployment

### Automatic (Recommended)

When you deploy to Vercel/Netlify/etc., migrations will run automatically during the build:

```bash
npm run build  # Runs migrations first, then builds Next.js
```

### Manual (If Needed)

If you need to run migrations manually on production:

```bash
# Set your production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Run migrations
npm run db:migrate:prod
```

## Troubleshooting

### Error: "report_entitlements table not found"

**Cause**: Migrations haven't been run on the production database

**Solution**: 
1. Redeploy the application (migrations will run automatically)
2. Or run migrations manually: `npm run db:migrate:prod`

### Build Fails with Migration Error

**Cause**: Database connection issue or schema conflict

**Solution**:
1. Verify `DATABASE_URL` environment variable is set correctly
2. Check database connection (try connecting with `psql` or Drizzle Studio)
3. Review migration logs for specific error messages

## Environment Variables Required

Make sure these are set in your deployment platform:

- `DATABASE_URL` - PostgreSQL connection string (required)
- All other env vars from `env.example`

## Development Workflow

1. **Modify Schema**: Edit `src/db/schema.ts`
2. **Generate Migration**: `npm run db:generate`
3. **Apply Locally**: `npm run db:migrate`
4. **Test**: Verify changes work locally
5. **Commit & Push**: Migration files are in `drizzle/` folder
6. **Deploy**: Migrations run automatically on build

## Migration Files

Current migrations:
- `0000_fair_lily_hollister.sql` - Initial schema
- `0001_dashing_silver_fox.sql` - Updates
- `0002_fresh_weapon_omega.sql` - More updates  
- `0003_old_senator_kelly.sql` - Additional changes
- `0004_outstanding_titania.sql` - Payment gateway updates
- `0005_sharp_zaran.sql` - **Report entitlements table** (fixes payment error)

## Verifying Migrations

Check if migrations were applied:

```bash
# Connect to your database
psql $DATABASE_URL

# Check migration history
SELECT * FROM drizzle."__drizzle_migrations" ORDER BY created_at;

# Verify report_entitlements table exists
\dt report_entitlements
```

## Support

If you encounter issues:
1. Check deployment logs for migration output
2. Verify DATABASE_URL is set in deployment platform
3. Try running migrations manually with `db:migrate:prod`
