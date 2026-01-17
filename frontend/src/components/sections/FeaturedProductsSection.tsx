"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";

export default function FeaturedProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products?limit=4");
        if (res.ok) {
          const data = await res.json();
          // improved robustness to handle both array and paginated response
          const products = Array.isArray(data) ? data : data.products || [];
          setFeaturedProducts(products);
        }
      } catch (error) {
        console.error("Failed to fetch featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section id="products" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <Badge
              variant="outline"
              className="text-primary border-primary mb-4"
            >
              BESTSELLERS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              Featured Products
            </h2>
          </div>
          <Link href="/shop">
            <Button
              variant="outline"
              className="mt-4 md:mt-0 border-primary text-primary hover:bg-primary hover:text-white"
            >
              View All Products →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-3/4 bg-muted/20 animate-pulse rounded-xl"
                />
              ))
            : featuredProducts.map((product) => (
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
      </div>
    </section>
  );
}
