-- CREATE TABLE "wishlist_items" (
-- 	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
-- 	"user_id" text NOT NULL,
-- 	"product_id" uuid NOT NULL,
-- 	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
-- 	CONSTRAINT "unique_user_wishlist_product" UNIQUE("user_id","product_id")
-- );
--> statement-breakpoint
-- ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_quantity_positive";--> statement-breakpoint
-- ALTER TABLE "coupons" DROP CONSTRAINT "coupons_discount_type_check";--> statement-breakpoint
-- ALTER TABLE "coupons" DROP CONSTRAINT "coupons_percentage_max";--> statement-breakpoint
-- ALTER TABLE "coupons" DROP CONSTRAINT "coupons_usage_check";--> statement-breakpoint
-- ALTER TABLE "coupons" DROP CONSTRAINT "coupons_discount_value_positive";--> statement-breakpoint
-- ALTER TABLE "order_items" DROP CONSTRAINT "order_items_quantity_positive";--> statement-breakpoint
-- ALTER TABLE "order_items" DROP CONSTRAINT "order_items_price_positive";--> statement-breakpoint
-- ALTER TABLE "orders" DROP CONSTRAINT "orders_status_valid";--> statement-breakpoint
-- ALTER TABLE "orders" DROP CONSTRAINT "orders_amounts_positive";--> statement-breakpoint
-- ALTER TABLE "payments" DROP CONSTRAINT "payments_status_valid";--> statement-breakpoint
-- ALTER TABLE "payments" DROP CONSTRAINT "payments_amount_positive";--> statement-breakpoint
-- ALTER TABLE "products" DROP CONSTRAINT "products_price_positive";--> statement-breakpoint
-- ALTER TABLE "products" DROP CONSTRAINT "products_stock_positive";--> statement-breakpoint
-- ALTER TABLE "products" DROP CONSTRAINT "products_rating_valid";--> statement-breakpoint
-- ALTER TABLE "reviews" DROP CONSTRAINT "reviews_rating_valid";--> statement-breakpoint
-- ALTER TABLE "reviews" DROP CONSTRAINT "reviews_order_id_orders_id_fk";
--> statement-breakpoint
-- DROP INDEX "idx_products_slug";--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_items" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
-- ALTER TABLE "coupons" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
-- ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- CREATE INDEX "idx_wishlist_items_user" ON "wishlist_items" USING btree ("user_id");--> statement-breakpoint
-- ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
-- CREATE INDEX "idx_orders_user_status" ON "orders" USING btree ("user_id","status");--> statement-breakpoint
-- ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_quantity_positive" CHECK ("cart_items"."quantity" > 0);--> statement-breakpoint
-- ALTER TABLE "coupons" ADD CONSTRAINT "coupons_usage_check" CHECK ("coupons"."used_count" >= 0);--> statement-breakpoint
-- ALTER TABLE "coupons" ADD CONSTRAINT "coupons_discount_value_positive" CHECK ("coupons"."discount_value" > 0);--> statement-breakpoint
-- ALTER TABLE "order_items" ADD CONSTRAINT "order_items_quantity_positive" CHECK ("order_items"."quantity" > 0);--> statement-breakpoint
-- ALTER TABLE "order_items" ADD CONSTRAINT "order_items_price_positive" CHECK ("order_items"."price" >= 0);--> statement-breakpoint
-- ALTER TABLE "orders" ADD CONSTRAINT "orders_amounts_positive" CHECK ("orders"."subtotal" >= 0 AND "orders"."shipping_cost" >= 0 AND "orders"."total" >= 0 AND "orders"."discount" >= 0);--> statement-breakpoint
-- ALTER TABLE "payments" ADD CONSTRAINT "payments_amount_positive" CHECK ("payments"."amount" > 0);--> statement-breakpoint
-- ALTER TABLE "products" ADD CONSTRAINT "products_original_price_valid" CHECK ("products"."original_price" IS NULL OR "products"."original_price" > 0);--> statement-breakpoint
-- ALTER TABLE "products" ADD CONSTRAINT "products_reviews_count_nonnegative" CHECK ("products"."reviews_count" >= 0);--> statement-breakpoint
-- ALTER TABLE "products" ADD CONSTRAINT "products_price_positive" CHECK ("products"."price" > 0);--> statement-breakpoint
-- ALTER TABLE "products" ADD CONSTRAINT "products_stock_positive" CHECK ("products"."stock" >= 0);--> statement-breakpoint
-- ALTER TABLE "products" ADD CONSTRAINT "products_rating_valid" CHECK ("products"."rating" >= 0 AND "products"."rating" <= 5);--> statement-breakpoint
-- ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rating_valid" CHECK ("reviews"."rating" >= 1 AND "reviews"."rating" <= 5);