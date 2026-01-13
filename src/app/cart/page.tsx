"use client";

import Link from "next/link";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { products } from "@/data/products";

export default function CartPage() {
  // Mock cart items - in real app this would come from state/database
  const cartItems = [
    { product: products[0], quantity: 1 },
    { product: products[2], quantity: 2 },
  ];

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseInt(item.product.price.replace(/[₹,]/g, ""));
    return acc + price * item.quantity;
  }, 0);

  const shipping = 0; // Free shipping
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
          <section className="pt-24 pb-8 bg-gradient-to-b from-primary/5 to-background">
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
                    {cartItems.length} items ready for checkout
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cart Content */}
          <div className="max-w-7xl mx-auto px-6 pb-24">
            {cartItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden border-border/50 hover:shadow-lg transition-all"
                    >
                      <CardContent className="p-0">
                        <div className="flex">
                          {/* Image */}
                          <Link
                            href={`/product/${item.product.id}`}
                            className="w-32 h-32 md:w-40 md:h-40 relative shrink-0 overflow-hidden bg-muted"
                          >
                            <div
                              className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-500"
                              style={{
                                backgroundImage: `url('${item.product.images[0]}')`,
                              }}
                            />
                          </Link>

                          {/* Details */}
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between">
                                <div>
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] mb-1"
                                  >
                                    {item.product.category}
                                  </Badge>
                                  <Link href={`/product/${item.product.id}`}>
                                    <h3 className="font-serif font-bold hover:text-primary transition-colors">
                                      {item.product.title}
                                    </h3>
                                  </Link>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive shrink-0"
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
                                >
                                  <span className="material-symbols-outlined text-lg">
                                    add
                                  </span>
                                </Button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className="text-lg font-black text-primary">
                                  {item.product.price}
                                </p>
                                {item.product.originalPrice && (
                                  <p className="text-xs text-muted-foreground line-through">
                                    {item.product.originalPrice}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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

                      <Button className="w-full h-12 text-base font-bold shadow-xl shadow-primary/20">
                        <span className="material-symbols-outlined mr-2">
                          lock
                        </span>
                        Secure Checkout
                      </Button>

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
            {cartItems.length > 0 && (
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
