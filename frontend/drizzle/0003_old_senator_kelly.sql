ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_price_positive";-->statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "product_type" text DEFAULT 'product' NOT NULL;-->statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_type" ON "products" USING btree ("product_type");-->statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_price_valid') THEN
    ALTER TABLE "products" ADD CONSTRAINT "products_price_valid" CHECK ("products"."price" >= 0);
  END IF;
END $$;