CREATE TABLE IF NOT EXISTS "report_entitlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"report_type" text NOT NULL,
	"order_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_report_type_entitlement" UNIQUE("user_id","report_type")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_report_entitlements_user" ON "report_entitlements" USING btree ("user_id");
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'report_entitlements_order_id_orders_id_fk'
  ) THEN
    ALTER TABLE "report_entitlements" ADD CONSTRAINT "report_entitlements_order_id_orders_id_fk"
    FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "cashfree_order_id" text;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "cashfree_payment_id" text;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "order_kind" text DEFAULT 'product' NOT NULL;
--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "cashfree_payment_id" text;
--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "cashfree_order_id" text;
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_cashfree_order_id_unique') THEN
    ALTER TABLE "orders" ADD CONSTRAINT "orders_cashfree_order_id_unique" UNIQUE("cashfree_order_id");
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payments_cashfree_payment_id_unique') THEN
    ALTER TABLE "payments" ADD CONSTRAINT "payments_cashfree_payment_id_unique" UNIQUE("cashfree_payment_id");
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'astrology_reports'
  ) THEN
    ALTER TABLE "astrology_reports" DROP CONSTRAINT IF EXISTS "astrology_reports_cache_key_unique";
    ALTER TABLE "astrology_reports" DROP CONSTRAINT IF EXISTS "astrology_reports_cache_key_key";
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_user_astrology_cache') THEN
      ALTER TABLE "astrology_reports" ADD CONSTRAINT "unique_user_astrology_cache" UNIQUE("user_id", "cache_key");
    END IF;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_order_kind_check') THEN
    ALTER TABLE "orders" ADD CONSTRAINT "orders_order_kind_check" CHECK("order_kind" IN ('product', 'report'));
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'report_entitlements_report_type_check') THEN
    ALTER TABLE "report_entitlements" ADD CONSTRAINT "report_entitlements_report_type_check" CHECK("report_type" IN ('1-year', '3-year', '5-year'));
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'astrology_reports_report_type_check') THEN
    ALTER TABLE "astrology_reports" ADD CONSTRAINT "astrology_reports_report_type_check" CHECK("report_type" IN ('1-year', '3-year', '5-year'));
  END IF;
END $$;
