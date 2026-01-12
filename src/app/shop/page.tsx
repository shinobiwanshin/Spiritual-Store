"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { products } from "@/data/products";

export default function Shop() {
  const categories = [
    "All",
    "Rudraksha",
    "Gemstones",
    "Yantras",
    "Idols",
    "Malas",
    "Incense",
    "Crystals",
  ];

  return (
    <div className="relative min-h-screen pb-24 bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="p-2 -ml-2 text-foreground/80 hover:text-foreground transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </Link>
          <h1 className="text-lg font-serif font-bold tracking-tight">
            Shop Collection
          </h1>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">search</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">filter_list</span>
          </Button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto hide-scrollbar">
          {categories.map((cat, i) => (
            <Badge
              key={i}
              variant={i === 0 ? "default" : "outline"}
              className={`rounded-full px-4 py-1.5 cursor-pointer whitespace-nowrap transition-all duration-300 ${
                i === 0
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                  : "hover:bg-primary/10 hover:text-primary hover:border-primary/50 border-border text-muted-foreground"
              }`}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tools & Sort */}
      <div className="flex items-center justify-between px-4 py-4">
        <p className="text-sm text-muted-foreground font-medium">
          {products.length} Products Found
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select defaultValue="popular">
            <SelectTrigger className="w-[130px] h-9 text-sm border-none shadow-none bg-transparent font-bold text-foreground p-0 focus:ring-0 hover:text-primary transition-colors">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popularity</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      <main className="px-4 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            className="min-w-[200px] border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/20"
          >
            Load More Products
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[#1b1a18] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h3 className="font-serif text-xl font-bold text-primary">
            VEDIC STORE
          </h3>
          <p className="text-gray-500 text-xs">
            © 2024 Vedic Store. All rights reserved.
          </p>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}
