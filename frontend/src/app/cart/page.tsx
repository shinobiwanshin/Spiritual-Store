"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/stores/cart-store";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    clearCart,
    fetchCart,
    isLoading,
  } = useCartStore();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      fetchCart();
    }
  }, [isSignedIn, fetchCart]);

  const subtotal = getTotalPrice();
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />

          {/* Hero Section */}
          <section className="pt-24 pb-8 bg-linear-to-b from-primary/5 to-background">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex items-center gap-4">
                <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-primary">
                    shopping_cart
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-serif font-bold">Your Cart</h1>
                  <p className="text-muted-foreground">
                    {items.length} {items.length === 1 ? "item" : "items"} ready
                    for checkout
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cart Content */}
          <div className="max-w-7xl mx-auto px-6 pb-24">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden border-border/50 hover:shadow-lg transition-all"
                    >
                      <CardContent className="p-0">
                        <div className="flex">
                          {/* Image */}
                          <Link
                            href={`/product/${item.id}`}
                            className="w-32 h-32 md:w-40 md:h-40 relative shrink-0 overflow-hidden bg-muted"
                          >
                            <div
                              className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-500"
                              style={{
                                backgroundImage: `url('${item.image}')`,
                              }}
                            />
                          </Link>

                          {/* Details */}
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between">
                                <div>
                                  <Link href={`/product/${item.id}`}>
                                    <h3 className="font-serif font-bold hover:text-primary transition-colors">
                                      {item.title}
                                    </h3>
                                  </Link>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive shrink-0"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <span className="material-symbols-outlined">
                                    delete
                                  </span>
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center border rounded-full">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                >
                                  <span className="material-symbols-outlined text-lg">
                                    remove
                                  </span>
                                </Button>
                                <span className="w-8 text-center font-bold text-sm">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                >
                                  <span className="material-symbols-outlined text-lg">
                                    add
                                  </span>
                                </Button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className="text-lg font-black text-primary">
                                  {item.price}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Clear Cart Button */}
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="text-destructive hover:bg-destructive hover:text-white"
                      onClick={clearCart}
                    >
                      <span className="material-symbols-outlined mr-2">
                        delete_sweep
                      </span>
                      Clear Cart
                    </Button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-24 border-border/50 shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-serif font-bold text-xl">
                        Order Summary
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Subtotal
                          </span>
                          <span className="font-medium">
                            ₹{subtotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Shipping
                          </span>
                          <span className="text-green-600 font-medium">
                            FREE
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Estimated Tax
                          </span>
                          <span className="font-medium">Included</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                          ₹{total.toLocaleString()}
                        </span>
                      </div>

                      {/* Coupon Code */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Coupon code"
                          className="flex-1 h-10 px-3 text-sm border rounded-lg bg-background"
                        />
                        <Button variant="outline" size="sm" className="h-10">
                          Apply
                        </Button>
                      </div>

                      <Link href="/checkout">
                        <Button className="w-full h-12 text-base font-bold shadow-xl shadow-primary/20">
                          <span className="material-symbols-outlined mr-2">
                            lock
                          </span>
                          Proceed to Checkout
                        </Button>
                      </Link>

                      {/* Trust Badges */}
                      <div className="flex items-center justify-center gap-4 pt-2 text-muted-foreground">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="material-symbols-outlined text-sm">
                            shield
                          </span>
                          Secure
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="material-symbols-outlined text-sm">
                            verified
                          </span>
                          Certified
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="material-symbols-outlined text-sm">
                            local_shipping
                          </span>
                          Free Ship
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="text-center py-20">
                <div className="size-32 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-6xl text-muted-foreground">
                    shopping_cart
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Looks like you haven&apos;t added any sacred items to your
                  cart yet. Start your spiritual journey now!
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

            {/* Continue Shopping */}
            {items.length > 0 && (
              <div className="mt-8 text-center">
                <Link href="/shop">
                  <Button variant="outline" className="gap-2">
                    <span className="material-symbols-outlined">
                      arrow_back
                    </span>
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <Footer />
        </div>
      </SignedIn>
    </>
  );
}
