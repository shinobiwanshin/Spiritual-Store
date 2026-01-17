"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlistStore } from "@/lib/stores/wishlist-store";

// Product type expected by QuickViewModal
interface QuickViewProduct {
  id: string;
  title: string;
  category: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  benefits?: string[];
  howToWear?: {
    bestDay: string;
    bestTime: string;
    mantra: string;
  };
  zodiacCompatibility?: string[];
  isLabCertified?: boolean;
}

export default function Wishlist() {
  const { items, isLoading, fetchWishlist } = useWishlistStore();
  const { isSignedIn } = useAuth();
  const [quickViewProduct, setQuickViewProduct] =
    useState<QuickViewProduct | null>(null);

  useEffect(() => {
    if (isSignedIn === true) {
      fetchWishlist();
    }
  }, [isSignedIn, fetchWishlist]);

  // Convert wishlist item to QuickView product format
  const handleQuickView = (item: (typeof items)[0]) => {
    const quickViewItem: QuickViewProduct = {
      id: item.id,
      title: item.title,
      category: item.categoryName || "Spiritual",
      price: item.price,
      originalPrice: item.originalPrice || undefined,
      discount: item.discount || undefined,
      rating: Number(item.rating) || 4.5,
      reviews: item.reviewsCount || 0,
      images: item.images || [],
      description: item.description || "",
      isLabCertified: item.isLabCertified || false,
    };
    setQuickViewProduct(quickViewItem);
  };

  // Auth still loading - show loading state
  if (isSignedIn === undefined) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin">
            <span className="material-symbols-outlined text-4xl text-primary">
              progress_activity
            </span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not signed in - show sign in prompt
  if (isSignedIn === false) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-3xl font-bold mb-4 font-crimson-text">
            Your Wishlist
          </h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to view your sacred collection.
          </p>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-8 bg-linear-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <div className="size-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-primary">
                favorite
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">
              Your Wishlist
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {isLoading
                ? "Loading your saved items..."
                : `${items.length} sacred items saved for later. Your spiritual journey awaits.`}
            </p>
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {isLoading && items.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin">
              <span className="material-symbols-outlined text-4xl text-primary">
                progress_activity
              </span>
            </div>
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  category={item.categoryName || "Spiritual"}
                  price={item.price}
                  reviews={item.reviewsCount || 0}
                  image={item.images?.[0] || ""}
                  originalPrice={item.originalPrice || undefined}
                  discount={item.discount || undefined}
                  onQuickView={() => handleQuickView(item)}
                />
              ))}
            </div>

            {/* Summary Card */}
            <Card className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20 mt-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-lg font-bold">
                      Ready to complete your purchase?
                    </p>
                    <p className="text-muted-foreground text-sm">
                      All items are lab-certified and come with authenticity
                      guarantee
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/shop">
                      <Button variant="outline">Continue Shopping</Button>
                    </Link>
                    <Link href="/cart">
                      <Button className="shadow-xl shadow-primary/20">
                        <span className="material-symbols-outlined mr-2">
                          shopping_cart
                        </span>
                        Go to Cart
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="size-32 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-6xl text-muted-foreground opacity-50">
                favorite_border
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start adding items you love to your wishlist. They&apos;ll appear
              here so you can easily find them later.
            </p>
            <Link href="/shop">
              <Button size="lg" className="rounded-full px-8 shadow-xl">
                <span className="material-symbols-outlined mr-2">explore</span>
                Explore Products
              </Button>
            </Link>
          </div>
        )}
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
