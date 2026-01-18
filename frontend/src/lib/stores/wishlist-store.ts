import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";
import { Product } from "@/db/schema";

// API response type for type safety
interface WishlistApiItem {
  id: string;
  addedAt: string;
  product: Product;
  categoryName: string | null;
}

// Extended Product with category name for display
interface WishlistProduct extends Product {
  categoryName?: string | null;
}

// Minimal type for adding items (doesn't require full Product)
export interface WishlistAddItem {
  id: string;
  title: string;
  price: string;
  images: string[];
}

interface WishlistState {
  items: WishlistProduct[];
  isLoading: boolean;

  // Actions
  fetchWishlist: () => Promise<void>;
  addItem: (product: WishlistAddItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchWishlist: async () => {
        set({ isLoading: true });
        try {
          const response = await axios.get("/api/wishlist");
          // API returns { items: [...], pagination: {...} } or legacy array
          const data = response.data;
          const wishlistData = Array.isArray(data) ? data : data?.items;

          if (wishlistData && Array.isArray(wishlistData)) {
            const products: WishlistProduct[] = wishlistData.map(
              (item: WishlistApiItem) => ({
                ...item.product,
                categoryName: item.categoryName,
              }),
            );
            set({ items: products });
          } else {
            set({ items: [] });
          }
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
          toast.error("Failed to load wishlist");
          // Only clear items if this was the initial load (items were already empty)
          if (get().items.length === 0) {
            set({ items: [] });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (product) => {
        // Optimistic update
        const currentItems = get().items;
        if (currentItems.some((item) => item.id === product.id)) return;

        // Add with minimal info for optimistic UI
        set({
          items: [
            ...currentItems,
            { ...product, categoryName: null } as WishlistProduct,
          ],
        });

        try {
          await axios.post("/api/wishlist", { productId: product.id });
          toast.success("Added to wishlist");
        } catch (error) {
          console.error("Failed to add to wishlist", error);
          toast.error("Failed to add to wishlist");
          // Revert on failure
          set({ items: currentItems });
        }
      },

      removeItem: async (productId) => {
        // Optimistic update
        const currentItems = get().items;
        set({ items: currentItems.filter((item) => item.id !== productId) });

        try {
          await axios.delete(`/api/wishlist/${productId}`);
          toast.success("Removed from wishlist");
        } catch (error) {
          console.error("Failed to remove from wishlist", error);
          toast.error("Failed to remove from wishlist");
          // Revert
          set({ items: currentItems });
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "astra-wishlist",
      // Don't persist loading state
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
