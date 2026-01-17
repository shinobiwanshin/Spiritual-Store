CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"line1" text NOT NULL,
	"line2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"pincode" text NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_user_product" UNIQUE("user_id","product_id"),
	CONSTRAINT "cart_items_quantity_positive" CHECK ("quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"discount_type" text NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"min_order_value" numeric(10, 2),
	"max_discount" numeric(10, 2),
	"usage_limit" integer,
	"used_count" integer DEFAULT 0,
	"valid_from" timestamp with time zone,
	"valid_until" timestamp with time zone,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "coupons_code_unique" UNIQUE("code"),
	CONSTRAINT "coupons_usage_check" CHECK ("used_count" >= 0),
	CONSTRAINT "coupons_discount_value_positive" CHECK ("discount_value" > 0),
	CONSTRAINT "coupons_discount_type_check" CHECK ("discount_type" IN ('percentage','fixed')),
    CONSTRAINT "coupons_percentage_max" CHECK ("discount_type" != 'percentage' OR "discount_value" <= 100),
    CONSTRAINT "coupons_validity_check" CHECK ("valid_from" IS NULL OR "valid_until" IS NULL OR "valid_from" < "valid_until")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"title" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "order_items_quantity_positive" CHECK ("quantity" > 0),
	CONSTRAINT "order_items_price_positive" CHECK ("price" >= 0)
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"razorpay_order_id" text,
	"razorpay_payment_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"shipping_cost" numeric(10, 2) DEFAULT '0',
	"discount" numeric(10, 2) DEFAULT '0',
	"total" numeric(10, 2) NOT NULL,
	"shipping_address" jsonb NOT NULL,
	"items_snapshot" jsonb NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "orders_razorpay_order_id_unique" UNIQUE("razorpay_order_id"),
	CONSTRAINT "orders_status_valid" CHECK ("status" IN ('pending','paid','processing','shipped','delivered','cancelled','refunded','confirmed')),
	CONSTRAINT "orders_amounts_positive" CHECK ("subtotal" >= 0 AND "shipping_cost" >= 0 AND "total" >= 0 AND "discount" >= 0)
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"razorpay_payment_id" text,
	"razorpay_order_id" text,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'INR',
	"status" text NOT NULL,
	"method" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "payments_razorpay_payment_id_unique" UNIQUE("razorpay_payment_id"),
	CONSTRAINT "payments_amount_positive" CHECK ("amount" > 0),
	CONSTRAINT "payments_status_valid" CHECK ("status" IN ('pending','completed','failed','refunded'))
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"original_price" numeric(10, 2),
	"discount" text,
	"images" text[] DEFAULT '{}' NOT NULL,
	"category_id" uuid,
	"is_lab_certified" boolean DEFAULT false,
	"rating" numeric(2, 1) DEFAULT '0',
	"reviews_count" integer DEFAULT 0,
	"benefits" text[] DEFAULT '{}',
	"how_to_wear" jsonb DEFAULT '{}'::jsonb,
	"zodiac_compatibility" text[] DEFAULT '{}',
	"stock" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_price_positive" CHECK ("price" > 0),
	CONSTRAINT "products_stock_positive" CHECK ("stock" >= 0),
	CONSTRAINT "products_rating_valid" CHECK ("rating" >= 0 AND "rating" <= 5),
    CONSTRAINT "products_original_price_valid" CHECK ("original_price" IS NULL OR "original_price" > 0),
    CONSTRAINT "products_reviews_count_nonnegative" CHECK ("reviews_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"order_id" uuid,
	"rating" integer NOT NULL,
	"title" text,
	"content" text,
	"is_verified_purchase" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_addresses_user" ON "addresses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_cart_items_user" ON "cart_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_order_items_order" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_order_items_product" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_orders_status" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_orders_user_status" ON "orders" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "idx_orders_created" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_payments_order" ON "payments" USING btree ("order_id");--> statement-breakpoint

CREATE INDEX "idx_products_category" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_reviews_product" ON "reviews" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_reviews_user" ON "reviews" USING btree ("user_id");
