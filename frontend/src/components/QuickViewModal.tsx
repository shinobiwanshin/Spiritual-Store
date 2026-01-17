"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/stores/cart-store";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Product {
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

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const addItem = useCartStore((state) => state.addItem);

  const handleAuthAction = (action: () => void) => {
    if (!isSignedIn) {
      openSignIn();
    } else {
      action();
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          {product.title} - Quick View
        </DialogTitle>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative h-80 md:h-full bg-muted">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${product.images[0]}')` }}
            />
            {product.discount && (
              <Badge className="absolute top-4 left-4 bg-terracotta text-white border-none">
                {product.discount}
              </Badge>
            )}
            {product.isLabCertified && (
              <Badge
                variant="outline"
                className="absolute top-4 right-4 bg-white/90 text-spiritual-blue border-spiritual-blue/30"
              >
                <span className="material-symbols-outlined text-sm mr-1">
                  verified
                </span>
                Lab Certified
              </Badge>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-8 space-y-5">
            <div>
              <Badge variant="outline" className="text-xs mb-2">
                {product.category}
              </Badge>
              <h2 className="font-serif text-2xl font-bold">{product.title}</h2>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= product.rating ? "fill-current" : "fill-gray-300"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-primary">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-3">
              {product.description}
            </p>

            {/* Zodiac Compatibility */}
            {product.zodiacCompatibility && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Best for:</span>
                {product.zodiacCompatibility.map((zodiac) => (
                  <Badge key={zodiac} variant="secondary" className="text-xs">
                    {zodiac}
                  </Badge>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <span className="material-symbols-outlined text-lg">
                    remove
                  </span>
                </Button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() =>
                  handleAuthAction(() => {
                    addItem({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image: product.images[0],
                    });
                    toast.success("Added to cart");
                  })
                }
              >
                <span className="material-symbols-outlined mr-2">
                  shopping_bag
                </span>
                Add to Cart
              </Button>
              <Button
                className="flex-1 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl hover:shadow-primary/30"
                onClick={() =>
                  handleAuthAction(() => {
                    addItem({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image: product.images[0],
                    });
                    toast.success("Proceeding to checkout");
                    // Implement checkout redirection here if needed
                  })
                }
              >
                Buy Now
              </Button>
            </div>

            {/* View Full Details */}
            <Link
              href={`/product/${product.id}`}
              className="block text-center text-sm text-primary hover:underline"
              onClick={onClose}
            >
              View Full Details →
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
