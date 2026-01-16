"use client";

import { useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products, Product } from "@/data/products";

export default function Wishlist() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  // Mock wishlist items - in real app this would come from state/database
  const wishlistItems = products.slice(0, 3);

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />

          {/* Hero Section */}
          <section className="pt-24 pb-8 bg-gradient-to-b from-primary/5 to-background">
            <div className="max-w-7xl mx-auto px-6 py-12">
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
                  {wishlistItems.length} sacred items saved for later. Your
                  spiritual journey awaits.
                </p>
              </div>
            </div>
          </section>

          {/* Wishlist Content */}
          <div className="max-w-5xl mx-auto px-6 pb-24">
            {wishlistItems.length > 0 ? (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <Card
                    key={item.id}
                    className="group overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <Link
                          href={`/product/${item.id}`}
                          className="w-full sm:w-48 h-48 sm:h-auto relative overflow-hidden bg-muted shrink-0"
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                            style={{
                              backgroundImage: `url('${item.images[0]}')`,
                            }}
                          />
                          {item.discount && (
                            <Badge className="absolute top-3 left-3 bg-terracotta">
                              {item.discount}
                            </Badge>
                          )}
                        </Link>

                        {/* Details */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] mb-2"
                                >
                                  {item.category}
                                </Badge>
                                <Link href={`/product/${item.id}`}>
                                  <h3 className="font-serif font-bold text-lg hover:text-primary transition-colors">
                                    {item.title}
                                  </h3>
                                </Link>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0 text-muted-foreground hover:text-destructive"
                              >
                                <span className="material-symbols-outlined">
                                  close
                                </span>
                              </Button>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                              <div className="flex text-yellow-500">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className="w-4 h-4 fill-current"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                ({item.reviews} reviews)
                              </span>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          {/* Price & Actions */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-primary">
                                {item.price}
                              </span>
                              {item.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {item.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-primary/30 text-primary hover:bg-primary hover:text-white"
                                onClick={() => setQuickViewProduct(item)}
                              >
                                <span className="material-symbols-outlined mr-1.5 text-base">
                                  visibility
                                </span>
                                Quick View
                              </Button>
                              <Button
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary hover:text-white"
                              >
                                <span className="material-symbols-outlined mr-2 text-lg">
                                  shopping_bag
                                </span>
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Summary Card */}
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mt-8">
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
              // Empty State
              <div className="text-center py-20">
                <div className="size-32 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-6xl text-muted-foreground">
                    favorite_border
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2">
                  Your wishlist is empty
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start adding items you love to your wishlist. They&apos;ll
                  appear here so you can easily find them later.
                </p>
                <Link href="/shop">
                  <Button size="lg" className="rounded-full px-8 shadow-xl">
                    <span className="material-symbols-outlined mr-2">
                      explore
                    </span>
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
      </SignedIn>
    </>
  );
}
