-- Supabase Database Schema for AstraSpiritual E-commerce
-- Run this in your Supabase SQL Editor

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  is_lab_certified BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  benefits TEXT[] DEFAULT '{}',
  how_to_wear JSONB DEFAULT '{}',
  zodiac_compatibility TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,  -- Clerk user ID
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Products: Anyone can read
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Cart items: Users can only access their own
CREATE POLICY "Users can view own cart" ON cart_items
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own cart items" ON cart_items
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own cart items" ON cart_items
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Addresses: Users can only access their own
CREATE POLICY "Users can view own addresses" ON addresses
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own addresses" ON addresses
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own addresses" ON addresses
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own addresses" ON addresses
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Orders: Users can only access their own
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);
