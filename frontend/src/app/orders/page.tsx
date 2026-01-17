"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  razorpay_order_id: string;
  status: string;
  total: number;
  items: Array<{
    product_id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  created_at: string;
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/orders?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          // Transform from Drizzle camelCase to component's expected format
          const transformedOrders = data.orders.map(
            (order: Record<string, unknown>) => ({
              id: order.id,
              razorpay_order_id: order.razorpayOrderId,
              status: order.status,
              total: parseFloat(order.total as string),
              items: order.items,
              created_at: order.createdAt,
            }),
          );
          setOrders(transformedOrders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "delivered":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
      {/* Success Message */}
      {success && (
        <Card className="mb-8 border-green-500/50 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="size-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">
                check_circle
              </span>
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-green-800 dark:text-green-400">
                Payment Successful!
              </h2>
              <p className="text-green-700 dark:text-green-500">
                Thank you for your order. You will receive a confirmation email
                shortly.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <h1 className="text-3xl font-serif font-bold mb-8">Your Orders</h1>

      {loading ? (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-4xl animate-spin text-primary">
            progress_activity
          </span>
          <p className="mt-4 text-muted-foreground">Loading your orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div
                        className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0"
                        style={{
                          backgroundImage: `url('${item.image}')`,
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold text-lg text-primary">
                    ₹{order.total.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="size-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-muted-foreground">
              receipt_long
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            Start your spiritual journey with our authentic products.
          </p>
          <Link href="/shop">
            <Button size="lg" className="rounded-full px-8">
              <span className="material-symbols-outlined mr-2">explore</span>
              Browse Products
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <Suspense
            fallback={
              <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-4xl animate-spin text-primary">
                    progress_activity
                  </span>
                  <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
              </div>
            }
          >
            <OrdersContent />
          </Suspense>
          <Footer />
        </div>
      </SignedIn>
    </>
  );
}
