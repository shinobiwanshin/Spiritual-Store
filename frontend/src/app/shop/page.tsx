"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { products, Product, getProductById } from "@/data/products";

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  const categories = [
    { name: "All", icon: "apps", count: products.length },
    { name: "Rudraksha", icon: "self_improvement", count: 5 },
    { name: "Gemstones", icon: "diamond", count: 4 },
    { name: "Yantras", icon: "grid_4x4", count: 2 },
    { name: "Malas", icon: "circle", count: 3 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-4 py-12">
            <Badge
              variant="outline"
              className="text-primary border-primary/30 px-4 py-1"
            >
              SACRED COLLECTION
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold">
              Discover Divine
              <span className="block text-primary">Treasures</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Lab-certified gemstones, authentic Rudraksha, and sacred spiritual
              items blessed with Vedic mantras
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-6">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  search
                </span>
                <Input
                  placeholder="Search for gemstones, rudraksha, yantras..."
                  className="pl-12 pr-32 h-14 rounded-full border-2 border-border/50 bg-background shadow-lg shadow-primary/5 focus:border-primary/50 focus:shadow-xl focus:shadow-primary/10 transition-all text-base"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 px-6 shadow-lg shadow-primary/20">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-serif font-bold text-lg mb-4">
                    Categories
                  </h3>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        selectedCategory === cat.name
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {cat.icon}
                      </span>
                      <span className="flex-1 text-left font-medium text-sm">
                        {cat.name}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedCategory === cat.name
                            ? "bg-white/20"
                            : "bg-muted"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Price Filter */}
              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-serif font-bold text-lg">Price Range</h3>
                  <div className="flex gap-2">
                    <Input placeholder="₹ Min" className="h-10 text-sm" />
                    <Input placeholder="₹ Max" className="h-10 text-sm" />
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    Apply
                  </Button>
                </CardContent>
              </Card>

              {/* Special Badge */}
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-4 text-center space-y-2">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    verified
                  </span>
                  <p className="font-serif font-bold text-sm">Lab Certified</p>
                  <p className="text-xs text-muted-foreground">
                    All products are certified for authenticity
                  </p>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground font-medium">
                  <span className="text-foreground font-bold">
                    {products.length}
                  </span>{" "}
                  Products
                </p>
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="size-8">
                    <span className="material-symbols-outlined text-lg">
                      grid_view
                    </span>
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8">
                    <span className="material-symbols-outlined text-lg">
                      view_list
                    </span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Sort by:
                </span>
                <Select defaultValue="popular">
                  <SelectTrigger className="w-[160px] h-9 border-border/50 rounded-lg">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  category={product.category}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  reviews={product.reviews}
                  image={product.images[0]}
                  onQuickView={() => setQuickViewProduct(product)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </Button>
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                    size="icon"
                    className="rounded-full"
                  >
                    {page}
                  </Button>
                ))}
                <span className="px-2 text-muted-foreground">...</span>
                <Button variant="outline" size="icon" className="rounded-full">
                  10
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Showing 1-12 of 120 products
              </p>
            </div>
          </main>
        </div>
      </div>

      <Footer />

      {/* QuickView Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
