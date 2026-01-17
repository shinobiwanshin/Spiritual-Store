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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// CATEGORIES
// ============================================
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

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
    discount: text("discount"),
    images: text("images").array().notNull().default([]), // Array of image URLs
    categoryId: uuid("category_id").references(() => categories.id),
    isLabCertified: boolean("is_lab_certified").default(false),
    rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
    reviewsCount: integer("reviews_count").default(0),
    benefits: text("benefits").array().default([]),
    howToWear: jsonb("how_to_wear").default({}),
    zodiacCompatibility: text("zodiac_compatibility").array().default([]),
    stock: integer("stock").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_products_slug").on(table.slug),
    index("idx_products_category").on(table.categoryId),
  ],
);

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
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_cart_items_user").on(table.userId),
    unique("unique_user_product").on(table.userId, table.productId),
  ],
);

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
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("idx_addresses_user").on(table.userId)],
);

// ============================================
// ORDERS
// ============================================
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
    shippingAddress: jsonb("shipping_address").notNull(), // Snapshot at checkout
    itemsSnapshot: jsonb("items_snapshot").notNull(), // Snapshot for display
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_orders_user").on(table.userId),
    index("idx_orders_status").on(table.status),
    index("idx_orders_created").on(table.createdAt),
  ],
);

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
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_order_items_order").on(table.orderId),
    index("idx_order_items_product").on(table.productId),
  ],
);

// ============================================
// PAYMENTS (audit log)
// ============================================
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
      enum: ["created", "authorized", "captured", "failed", "refunded"],
    }).notNull(),
    method: text("method"), // card, upi, netbanking, etc.
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("idx_payments_order").on(table.orderId)],
);

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
    orderId: uuid("order_id").references(() => orders.id),
    rating: integer("rating").notNull(), // 1-5
    title: text("title"),
    content: text("content"),
    isVerifiedPurchase: boolean("is_verified_purchase").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_reviews_product").on(table.productId),
    index("idx_reviews_user").on(table.userId),
  ],
);

// ============================================
// COUPONS
// ============================================
export const coupons = pgTable("coupons", {
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
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// RELATIONS
// ============================================
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  reviews: many(reviews),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
  payments: many(payments),
}));

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

export type NewProduct = typeof products.$inferInsert;
export type NewOrder = typeof orders.$inferInsert;
export type NewOrderItem = typeof orderItems.$inferInsert;
