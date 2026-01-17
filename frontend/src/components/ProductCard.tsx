"use client";

import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  price: string;
  reviews: number;
  image: string;
  originalPrice?: string;
  discount?: string;
  onQuickView?: () => void;
}

export default function ProductCard({
  id,
  title,
  category,
  price,
  reviews,
  image,
  originalPrice,
  discount,
  onQuickView,
}: ProductCardProps) {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const addItem = useCartStore((state) => state.addItem);

  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const inWishlist = isInWishlist(id);

  const handleAuthAction = (action: () => void) => {
    if (!isSignedIn) {
      openSignIn();
    } else {
      action();
    }
  };

  return (
    <Card className="group overflow-hidden border border-primary/10 rounded-2xl bg-card shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/product/${id}`}>
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
            style={{ backgroundImage: `url('${image}')` }}
            role="img"
            aria-label={title}
          />
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </Link>

        {/* Discount Badge */}
        {discount && (
          <Badge className="absolute top-3 left-3 bg-terracotta text-white border-none shadow-lg">
            {discount}
          </Badge>
        )}

        {/* Quick Actions - Appear on Hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <Button
            size="icon"
            variant="secondary"
            className={`size-10 rounded-full bg-white shadow-xl hover:scale-110 transition-all duration-300 ${
              inWishlist
                ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                : "text-primary hover:bg-primary hover:text-white"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAuthAction(() => {
                if (inWishlist) {
                  removeFromWishlist(id);
                } else {
                  addToWishlist({
                    id,
                    title,
                    price,
                    images: [image],
                    // Partial product object for store optimistic updates
                    // The store expects Product type, here we pass relevant UI fields
                    // Using 'as any' to bypass strict schema checks for now since we lack full data
                  } as any);
                }
              });
            }}
          >
            <span
              className={`material-symbols-outlined text-lg ${inWishlist ? "fill-current" : ""}`}
            >
              favorite
            </span>
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="size-10 rounded-full bg-white text-primary shadow-xl hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onQuickView) {
                onQuickView();
              }
            }}
          >
            <span className="material-symbols-outlined text-lg">
              visibility
            </span>
          </Button>
        </div>

        {/* Add to Cart - Appears on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            className="w-full h-10 rounded-xl font-bold shadow-lg gap-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAuthAction(() => {
                addItem({ id, title, price, image });
                toast.success("Added to cart");
              });
            }}
          >
            <span className="material-symbols-outlined text-lg">
              shopping_bag
            </span>
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Content */}
      <Link href={`/product/${id}`}>
        <CardContent className="p-4 space-y-2">
          <Badge
            variant="outline"
            className="text-[10px] text-primary border-primary/30 px-2 py-0.5 font-bold uppercase tracking-wider"
          >
            {category}
          </Badge>
          <h3 className="font-serif font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-3.5 h-3.5 text-yellow-500 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              ({reviews})
            </span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-black text-primary">{price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
