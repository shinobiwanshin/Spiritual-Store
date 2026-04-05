"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/stores/cart-store";
import { loadCashfreeScript } from "@/lib/cashfree-client";

declare global {
  interface Window {
    Cashfree?: (opts: { mode: "sandbox" | "production" }) => {
      checkout: (opts: {
        paymentSessionId: string;
        returnUrl?: string;
      }) => Promise<void>;
    };
  }
}



function cashfreeMode(): "sandbox" | "production" {
  return process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
    ? "production"
    : "sandbox";
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const verifyOnceRef = useRef(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const total = getTotalPrice();

  useEffect(() => {
    const cf = searchParams.get("cf");
    const orderId = searchParams.get("order_id");
    if (!cf || !orderId || verifyOnceRef.current) return;
    verifyOnceRef.current = true;

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setVerifyError(null);
      try {
        const raw = sessionStorage.getItem("cashfree_checkout");
        type CheckoutPayload = {
          items: Array<{
            id: string;
            title: string;
            price: string;
            image: string;
            quantity: number;
          }>;
          total: number;
          shipping_address: {
            name: string;
            line1: string;
            line2?: string;
            city: string;
            state: string;
            pincode: string;
            phone: string;
          };
        };
        let payload: CheckoutPayload | null = null;
        if (raw) {
          try {
            payload = JSON.parse(raw) as CheckoutPayload;
          } catch {
            payload = null;
          }
        }
        const lineItems = payload?.items?.length ? payload.items : items;
        const sum = payload?.total ?? total;
        const ship = payload?.shipping_address ?? {
          name: address.name,
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          phone: address.phone,
        };

        if (!lineItems.length) {
          throw new Error("Your cart was empty. Open checkout from the cart and try again.");
        }

        const res = await fetch("/api/cashfree/verify-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cashfree_order_id: orderId,
            items: lineItems.map((item) => {
              let parsedPrice = 0;
              if (typeof item.price === "number") {
                parsedPrice = item.price;
              } else if (typeof item.price === "string") {
                const cleaned = item.price.replace(/[₹,]/g, "").trim();
                parsedPrice = parseFloat(cleaned);
              }
              if (isNaN(parsedPrice)) {
                throw new Error(`Invalid price for item: ${item.title}`);
              }
              return {
                product_id: item.id,
                title: item.title,
                price: parsedPrice,
                quantity: item.quantity,
                image: item.image,
              };
            }),
            total: sum,
            shipping_address: ship,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error((data as { error?: string }).error || "Verification failed");
        }
        if (!cancelled) {
          sessionStorage.removeItem("cashfree_checkout");
          await clearCart();
          router.replace("/orders?success=true");
        }
      } catch (e) {
        verifyOnceRef.current = false;
        if (!cancelled) {
          setVerifyError(
            e instanceof Error ? e.message : "Could not verify payment",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, items, total, clearCart, router]);

  const handlePayment = async () => {
    if (
      !address.name ||
      !address.phone ||
      !address.line1 ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      alert("Please fill in all required address fields");
      return;
    }

    setIsLoading(true);
    setVerifyError(null);

    try {
      const response = await fetch("/api/cashfree/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          customerPhone: address.phone,
          returnPath: "/checkout",
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || "Failed to create order");
      }

      const data = await response.json();
      const paymentSessionId = data.paymentSessionId as string;
      const orderId = data.orderId as string;
      const isMock = data.mock === true;

      if (isMock) {
        const verifyResponse = await fetch("/api/cashfree/verify-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cashfree_order_id: orderId,
            items: items.map((item) => ({
              product_id: item.id,
              title: item.title,
              price: parseFloat(item.price.replace(/[₹,]/g, "")),
              quantity: item.quantity,
              image: item.image,
            })),
            total,
            shipping_address: {
              name: address.name,
              line1: address.line1,
              line2: address.line2 || undefined,
              city: address.city,
              state: address.state,
              pincode: address.pincode,
              phone: address.phone,
            },
          }),
        });
        if (verifyResponse.ok) {
          await clearCart();
          router.push("/orders?success=true");
        } else {
          const err = await verifyResponse.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error || "Verification failed");
        }
        return;
      }

      const loaded = await loadCashfreeScript();
      if (!loaded || !window.Cashfree) {
        throw new Error("Failed to load payment gateway");
      }

      sessionStorage.setItem(
        "cashfree_checkout",
        JSON.stringify({
          items,
          total,
          shipping_address: {
            name: address.name,
            line1: address.line1,
            line2: address.line2 || undefined,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            phone: address.phone,
          },
        }),
      );

      const cashfree = window.Cashfree({ mode: cashfreeMode() });
      const returnUrl = `${window.location.origin}/checkout?cf=1&order_id=${encodeURIComponent(orderId)}`;

      await cashfree.checkout({
        paymentSessionId,
        returnUrl,
      });
    } catch (error) {
      console.error("Payment error:", error);
      alert(
        error instanceof Error ? error.message : "Payment failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0 && !searchParams.get("cf")) {
    router.push("/cart");
    return null;
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />

          <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
            <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

            {verifyError && (
              <p className="mb-4 text-sm text-destructive">{verifyError}</p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="font-serif font-bold text-xl">
                      Shipping Address
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input
                          value={address.name}
                          onChange={(e) =>
                            setAddress({ ...address, name: e.target.value })
                          }
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number *</Label>
                        <Input
                          value={address.phone}
                          onChange={(e) =>
                            setAddress({ ...address, phone: e.target.value })
                          }
                          placeholder="+91 XXXXXXXXXX"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Address Line 1 *</Label>
                      <Input
                        value={address.line1}
                        onChange={(e) =>
                          setAddress({ ...address, line1: e.target.value })
                        }
                        placeholder="House/Flat No., Building Name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Address Line 2</Label>
                      <Input
                        value={address.line2}
                        onChange={(e) =>
                          setAddress({ ...address, line2: e.target.value })
                        }
                        placeholder="Street, Landmark (optional)"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Input
                          value={address.city}
                          onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                          }
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State *</Label>
                        <Input
                          value={address.state}
                          onChange={(e) =>
                            setAddress({ ...address, state: e.target.value })
                          }
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>PIN Code *</Label>
                        <Input
                          value={address.pincode}
                          onChange={(e) =>
                            setAddress({ ...address, pincode: e.target.value })
                          }
                          placeholder="6 digit PIN"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-serif font-bold text-xl">
                      Order Summary
                    </h3>

                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div
                            className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0"
                            style={{ backgroundImage: `url('${item.image}')` }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-bold text-primary">
                              {item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-green-600">FREE</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>

                    <Button
                      className="w-full h-12 text-base font-bold shadow-xl shadow-primary/20"
                      onClick={handlePayment}
                      disabled={
                        isLoading ||
                        items.length === 0 ||
                        Boolean(searchParams.get("cf"))
                      }
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin mr-2">
                            progress_activity
                          </span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined mr-2">
                            payments
                          </span>
                          Pay ₹{total.toLocaleString()}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Secured by Cashfree. Cards, UPI, and net banking supported.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-primary text-3xl">
            progress_activity
          </span>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
