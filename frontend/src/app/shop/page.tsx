"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCartStore } from "@/lib/stores/cart-store";

// Type definition matching the API response
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
  stock: number;
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

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );

  // Filters & Pagination State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedPriceRange, setAppliedPriceRange] = useState({
    min: "",
    max: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(12);

  // Alert State
  const [alertInfo, setAlertInfo] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "All")
          params.append("category", selectedCategory);
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (appliedPriceRange.min)
          params.append("minPrice", appliedPriceRange.min);
        if (appliedPriceRange.max)
          params.append("maxPrice", appliedPriceRange.max);
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        const response = await fetch(`/api/products?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
          if (data.pagination) {
            setTotalPages(data.pagination.totalPages);
            setTotalCount(data.pagination.total);
          }
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setAlertInfo({
          title: "Error",
          message: "Failed to load products. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, debouncedSearch, appliedPriceRange, page, limit]);

  const handlePriceApply = () => {
    setAppliedPriceRange({ min: minPrice, max: maxPrice });
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setAppliedPriceRange({ min: "", max: "" });
    setPage(1);
  };

  const categories = [
    { name: "All", icon: "apps" },
    { name: "Rudraksha", icon: "self_improvement" },
    { name: "Gemstones", icon: "diamond" },
    { name: "Yantras", icon: "grid_4x4" },
    { name: "Malas", icon: "circle" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-4 py-8">
            <Badge
              variant="outline"
              className="text-primary border-primary/30 px-4 py-1"
            >
              SACRED COLLECTION
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold">
              Discover Divine{" "}
              <span className="block text-primary">Treasures</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Lab-certified gemstones, authentic Rudraksha, and sacred spiritual
              items.
            </p>

            {/* Sticky Alert */}
            {alertInfo && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in fade-in slide-in-from-top-4">
                <Alert className="bg-background/95 backdrop-blur border-primary/30 shadow-xl">
                  <span className="material-symbols-outlined text-primary h-4 w-4">
                    info
                  </span>
                  <AlertTitle>{alertInfo.title}</AlertTitle>
                  <AlertDescription>{alertInfo.message}</AlertDescription>
                  <button
                    onClick={() => setAlertInfo(null)}
                    className="absolute right-4 top-4 hover:opacity-70"
                  >
                    <span className="material-symbols-outlined text-sm">
                      close
                    </span>
                  </button>
                </Alert>
              </div>
            )}

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-6">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  search
                </span>
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 h-14 rounded-full border-2 border-border/50 bg-background shadow-lg shadow-primary/5 focus:border-primary/50 text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Filter Reset Dialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-destructive"
                  >
                    <span className="material-symbols-outlined mr-2">
                      restart_alt
                    </span>
                    Reset Filters
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset all filters?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear your search, category selection, and price
                      range.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetFilters}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-serif font-bold text-lg mb-4">
                    Categories
                  </h3>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setPage(1);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        selectedCategory === cat.name
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {cat.icon}
                      </span>
                      <span className="flex-1 text-left font-medium text-sm">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-serif font-bold text-lg">Price Range</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="h-10 text-sm"
                      type="number"
                    />
                    <Input
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="h-10 text-sm"
                      type="number"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={handlePriceApply}
                  >
                    Apply Filter
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
              <p className="text-muted-foreground font-medium">
                <span className="text-foreground font-bold">{totalCount}</span>{" "}
                Products Found
              </p>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Sort:</span>
                <Select defaultValue="popular">
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price_low">Price: Low</SelectItem>
                    <SelectItem value="price_high">Price: High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] bg-muted/20 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      image={product.images[0]}
                      onQuickView={() => setQuickViewProduct(product)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="mt-12 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="rounded-full"
                    >
                      <span className="material-symbols-outlined">
                        chevron_left
                      </span>
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === totalPages ||
                          (p >= page - 1 && p <= page + 1),
                      )
                      .map((p, i, arr) => (
                        <>
                          {i > 0 && arr[i - 1] !== p - 1 && (
                            <span
                              key={`sep-${p}`}
                              className="px-2 text-muted-foreground"
                            >
                              ...
                            </span>
                          )}
                          <Button
                            key={p}
                            variant={page === p ? "default" : "outline"}
                            size="icon"
                            onClick={() => setPage(p)}
                            className="rounded-full"
                          >
                            {p}
                          </Button>
                        </>
                      ))}

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="rounded-full"
                    >
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-2xl">
                <span className="material-symbols-outlined text-4xl text-muted-foreground mb-4">
                  search_off
                </span>
                <h3 className="text-xl font-bold font-serif">
                  No products found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleResetFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
