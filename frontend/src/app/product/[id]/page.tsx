"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StarRating from "@/components/StarRating";
import Navbar from "@/components/Navbar";
import { useCartStore } from "@/lib/stores/cart-store";
import { toast } from "sonner";

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
  benefits: string[];
  howToWear: {
    bestDay: string;
    bestTime: string;
    mantra: string;
  };
  zodiacCompatibility: string[];
  isLabCertified: boolean;
}

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id as string;
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);

        // Fetch "Divine Pairings" based on Zodiac Compatibility
        // If product has zodiacs, find other products that match those zodiacs
        // Otherwise fallback to same category
        let relatedQuery = "";

        if (data.zodiacCompatibility && data.zodiacCompatibility.length > 0) {
          const zodiacs = data.zodiacCompatibility.join(",");
          relatedQuery = `?zodiac=${zodiacs}&limit=5&exclude=${productId}`;
        } else if (data.category) {
          relatedQuery = `?category=${data.category}&limit=5&exclude=${productId}`;
        }

        if (relatedQuery) {
          const relatedRes = await fetch(`/api/products${relatedQuery}`);
          if (relatedRes.ok) {
            const result = await relatedRes.json();
            // API returns { products: [], pagination: {} }
            // If API returns plain array (old behavior), handle it, but our new API returns object
            const relatedData = result.products || result;

            setRelatedProducts(Array.isArray(relatedData) ? relatedData : []);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const handleAuthAction = (action: () => void) => {
    if (!isSignedIn) {
      openSignIn();
    } else {
      action();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Fallback if product not found
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-serif font-bold">Product Not Found</h1>
          <p className="text-muted-foreground">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navbar */}
      {/* Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Images Section */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row-reverse gap-4 h-auto lg:h-[600px]">
            <div className="flex-1 relative rounded-2xl overflow-hidden shadow-2xl group cursor-zoom-in h-[400px] lg:h-full bg-muted">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${product.images[activeImage]}')`,
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-6 right-6 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/40 text-white transition-transform hover:scale-110 active:scale-95"
              >
                <span className="material-symbols-outlined">zoom_in</span>
              </Button>
            </div>

            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible py-2 lg:py-0 w-full lg:w-24">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square w-20 lg:w-full rounded-lg overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                    activeImage === idx
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`w-full h-full object-cover ${
                      activeImage === idx ? "" : "opacity-80 hover:opacity-100"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-primary tracking-[0.2em] uppercase">
                    {product.category}
                  </span>
                  <h1 className="font-serif text-3xl lg:text-4xl font-bold leading-tight text-foreground">
                    {product.title}
                  </h1>
                </div>
                {product.isLabCertified && (
                  <Badge
                    variant="outline"
                    className="bg-spiritual-blue/10 text-spiritual-blue border-spiritual-blue/20 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 shrink-0"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">
                      verified
                    </span>{" "}
                    Lab Certified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} size="lg" />
                <span className="text-sm font-bold">{product.rating}</span>
                <span className="text-sm text-muted-foreground border-l border-border ml-2 pl-2">
                  {product.reviews.toLocaleString()} reviews
                </span>
              </div>

              <div className="flex items-baseline gap-4 py-2 border-y border-primary/10">
                <p className="text-terracotta text-4xl font-black">
                  {product.price}
                </p>
                {product.originalPrice && (
                  <p className="text-muted-foreground line-through text-xl">
                    {product.originalPrice}
                  </p>
                )}
                {product.discount && (
                  <Badge className="bg-terracotta/10 text-terracotta hover:bg-terracotta/20 border-none px-3 py-1 rounded text-sm font-bold">
                    {product.discount}
                  </Badge>
                )}
              </div>
            </div>

            {/* Astrology Toggle Card */}
            <Card className="bg-card border-primary/20 relative overflow-hidden group shadow-md transition-shadow hover:shadow-lg">
              <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">
                <span className="material-symbols-outlined text-[120px] text-primary">
                  auto_awesome
                </span>
              </div>
              <div className="p-6 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">relax</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-primary">
                      Astrology Compatibility
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Best for: {product.zodiacCompatibility.join(", ")}
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                variant="outline"
                className="h-16 border-2 border-primary text-primary font-bold rounded-xl gap-2 hover:bg-primary/5 text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() =>
                  handleAuthAction(() => {
                    if (product) {
                      addItem({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.images[0],
                      });
                      toast.success("Added to cart");
                    }
                  })
                }
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                Add to Cart
              </Button>
              <Button
                className="h-16 bg-primary text-primary-foreground font-black text-xl rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/90 text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl hover:shadow-primary/30"
                onClick={() =>
                  handleAuthAction(() => {
                    if (product) {
                      addItem({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.images[0],
                      });
                      toast.success("Proceeding to checkout");
                    }
                  })
                }
              >
                Buy Now
              </Button>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-serif font-bold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-card border-primary/5 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-8 bg-primary/10 rounded flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-xl">
                        self_improvement
                      </span>
                    </div>
                    <h2 className="font-serif text-lg font-bold">
                      Spiritual Benefits
                    </h2>
                  </div>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary font-bold">•</span>{" "}
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card border-primary/5 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-8 bg-primary/10 rounded flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-xl">
                        water_drop
                      </span>
                    </div>
                    <h2 className="font-serif text-lg font-bold">
                      How to Wear
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Best Day
                      </p>
                      <p className="text-sm font-bold">
                        {product.howToWear.bestDay}
                      </p>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Best Time
                      </p>
                      <p className="text-sm font-bold">
                        {product.howToWear.bestTime}
                      </p>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg col-span-2">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Mantra
                      </p>
                      <p className="text-sm font-bold italic">
                        {product.howToWear.mantra}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24 space-y-8">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="font-serif text-3xl font-bold">Divine Pairings</h2>
              <p className="text-muted-foreground">
                Products that enhance your spiritual journey
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-primary/20 hover:bg-primary/10 transition-transform active:scale-95 hover:scale-110"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-primary text-primary hover:bg-primary/10 transition-transform active:scale-95 hover:scale-110"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {relatedProducts.map((item) => (
              <Link key={item.id} href={`/product/${item.id}`}>
                <Card className="rounded-2xl overflow-hidden border border-primary/10 hover:shadow-xl transition-all group bg-card">
                  <div className="h-48 overflow-hidden bg-muted flex items-center justify-center">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{ backgroundImage: `url('${item.images[0]}')` }}
                    ></div>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-sm font-bold truncate">{item.title}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-primary font-black">{item.price}</p>
                      <Button
                        size="icon"
                        className="size-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-none h-8 w-8 hover:scale-110 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-base">
                          add
                        </span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-24 bg-card text-foreground py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-primary">
              ASTRASPIRITUAL
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bringing ancient wisdom to the modern world through authentic
              religious products and astrological guidance.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest">
              Support
            </h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest">
              Trust
            </h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Lab Certification
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Authenticity Check
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Astrology Experts
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest">
              Connect
            </h4>
            <div className="flex gap-4">
              <Link
                href="#"
                className="size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">share</span>
              </Link>
              <Link
                href="#"
                className="size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">mail</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/10 text-center text-gray-500 text-xs">
          © 2024 AstraSpiritual. All sacred items are ethically sourced and lab
          certified.
        </div>
      </footer>
    </div>
  );
}
