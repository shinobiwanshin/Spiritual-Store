import {
  pgTable,
  uuid,
  text,
  decimal,
  boolean,
  integer,
  timestamp,
  jsonb,
  index,
  unique,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ============================================
// CATEGORIES
// ============================================
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// ============================================
// PRODUCTS
// ============================================
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
    discount: text("discount"), // Kept as text per instruction, avoiding rename to minimize breaking changes
    images: text("images").array().notNull().default([]), // Array of image URLs
    categoryId: uuid("category_id").references(() => categories.id),
    isLabCertified: boolean("is_lab_certified").default(false),
    rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
    reviewsCount: integer("reviews_count").default(0),
    benefits: text("benefits").array().default([]),
    howToWear: jsonb("how_to_wear").default({}),
    zodiacCompatibility: text("zodiac_compatibility").array().default([]),
    stock: integer("stock").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_products_category").on(table.categoryId),
    check("products_price_positive", sql`${table.price} > 0`),
    check("products_stock_positive", sql`${table.stock} >= 0`),
    check(
      "products_rating_valid",
      sql`${table.rating} >= 0 AND ${table.rating} <= 5`,
    ),
    check(
      "products_original_price_valid",
      sql`${table.originalPrice} IS NULL OR ${table.originalPrice} > 0`,
    ),
    check(
      "products_reviews_count_nonnegative",
      sql`${table.reviewsCount} >= 0`,
    ),
  ],
);

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  reviews: many(reviews),
}));

// ============================================
// CART ITEMS
// ============================================
export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(), // Clerk user ID
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_cart_items_user").on(table.userId),
    unique("unique_user_product").on(table.userId, table.productId),
    check("cart_items_quantity_positive", sql`${table.quantity} > 0`),
  ],
);

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

// ============================================
// ADDRESSES
// ============================================

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    line1: text("line1").notNull(),
    line2: text("line2"),
    city: text("city").notNull(),
    state: text("state").notNull(),
    pincode: text("pincode").notNull(),
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("idx_addresses_user").on(table.userId)],
);

// ============================================
// ORDERS
// ============================================
export interface ShippingAddressSnapshot {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderItemSnapshot {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    razorpayOrderId: text("razorpay_order_id").unique(),
    razorpayPaymentId: text("razorpay_payment_id"),
    status: text("status", {
      enum: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "confirmed",
      ],
    })
      .default("pending")
      .notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default(
      "0",
    ),
    discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    shippingAddress: jsonb("shipping_address")
      .$type<ShippingAddressSnapshot>()
      .notNull(),
    itemsSnapshot: jsonb("items_snapshot")
      .$type<OrderItemSnapshot[]>()
      .notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_orders_user").on(table.userId),
    index("idx_orders_status").on(table.status),
    index("idx_orders_created").on(table.createdAt),
    index("idx_orders_user_status").on(table.userId, table.status),
    check(
      "orders_amounts_positive",
      sql`${table.subtotal} >= 0 AND ${table.shippingCost} >= 0 AND ${table.total} >= 0 AND ${table.discount} >= 0`,
    ),
  ],
);

export const ordersRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
  payments: many(payments),
}));

// ============================================
// ORDER ITEMS (for analytics & queries)
// ============================================
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .references(() => orders.id, { onDelete: "cascade" })
      .notNull(),
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),
    title: text("title").notNull(), // Snapshot
    price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Price at purchase
    quantity: integer("quantity").notNull(),
    image: text("image"), // Snapshot of first image
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_order_items_order").on(table.orderId),
    index("idx_order_items_product").on(table.productId),
    check("order_items_quantity_positive", sql`${table.quantity} > 0`),
    check("order_items_price_positive", sql`${table.price} >= 0`),
  ],
);

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// ============================================
// PAYMENTS (audit log)
// ============================================
export interface PaymentMetadata {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  notes?: Record<string, string>;
  [key: string]: unknown;
}

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .references(() => orders.id)
      .notNull(),
    razorpayPaymentId: text("razorpay_payment_id").unique(),
    razorpayOrderId: text("razorpay_order_id"),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").default("INR"),
    status: text("status", {
      enum: [
        "created",
        "authorized",
        "captured",
        "failed",
        "refunded",
        "pending",
        "completed",
      ],
    }).notNull(),
    method: text("method"), // card, upi, netbanking, etc.
    metadata: jsonb("metadata").$type<PaymentMetadata>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_payments_order").on(table.orderId),
    check("payments_amount_positive", sql`${table.amount} > 0`),
  ],
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

// ============================================
// REVIEWS
// ============================================
export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "set null",
    }), // Set null on delete
    rating: integer("rating").notNull(), // 1-5
    title: text("title"),
    content: text("content"),
    isVerifiedPurchase: boolean("is_verified_purchase").default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_reviews_product").on(table.productId),
    index("idx_reviews_user").on(table.userId),
    check(
      "reviews_rating_valid",
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
    ),
    unique("unique_user_product_review").on(table.userId, table.productId),
  ],
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
}));

// ============================================
// COUPONS
// ============================================
export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    discountType: text("discount_type", {
      enum: ["percentage", "fixed"],
    }).notNull(),
    discountValue: decimal("discount_value", {
      precision: 10,
      scale: 2,
    }).notNull(),
    minOrderValue: decimal("min_order_value", { precision: 10, scale: 2 }),
    maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
    usageLimit: integer("usage_limit"),
    usedCount: integer("used_count").default(0),
    validFrom: timestamp("valid_from", { withTimezone: true }),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check("coupons_usage_check", sql`${table.usedCount} >= 0`),
    check("coupons_discount_value_positive", sql`${table.discountValue} > 0`),
  ],
);

export const couponsRelations = relations(coupons, () => ({}));

// ============================================
// WISHLIST ITEMS
// ============================================
export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_wishlist_items_user").on(table.userId),
    unique("unique_user_wishlist_product").on(table.userId, table.productId),
  ],
);

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
}));

// ============================================
// TYPE EXPORTS
// ============================================
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type WishlistItem = typeof wishlistItems.$inferSelect;

export type NewCategory = typeof categories.$inferInsert;
export type NewProduct = typeof products.$inferInsert;
export type NewCartItem = typeof cartItems.$inferInsert;
export type NewAddress = typeof addresses.$inferInsert;
export type NewOrder = typeof orders.$inferInsert;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type NewPayment = typeof payments.$inferInsert;
export type NewReview = typeof reviews.$inferInsert;
export type NewCoupon = typeof coupons.$inferInsert;
export type NewWishlistItem = typeof wishlistItems.$inferInsert;
