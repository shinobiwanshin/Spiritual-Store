import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";
import { Product } from "@/db/schema";

// Extended Product with category name for display
interface WishlistProduct extends Product {
  categoryName?: string | null;
}

interface WishlistState {
  items: WishlistProduct[];
  isLoading: boolean;

  // Actions
  fetchWishlist: () => Promise<void>;
  addItem: (product: Product) => Promise<void>;
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
          // Expecting response to be array of objects with { product: Product }
          // Based on API implementation:
          // const userWishlist = await db.select({ ..., product: products })...

          if (response.data) {
            const products: WishlistProduct[] = response.data.map(
              (item: any) => ({
                ...item.product,
                categoryName: item.categoryName,
              }),
            );
            set({ items: products });
          }
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (product) => {
        // Optimistic update
        const currentItems = get().items;
        if (currentItems.some((item) => item.id === product.id)) return;

        set({ items: [...currentItems, product] });
        toast.success("Added to wishlist");

        try {
          await axios.post("/api/wishlist", { productId: product.id });
        } catch (error) {
          console.error("Failed to add to wishlist", error);
          toast.error("Failed to sync wishlist");
          // Revert on failure
          set({ items: currentItems });
        }
      },

      removeItem: async (productId) => {
        // Optimistic update
        const currentItems = get().items;
        set({ items: currentItems.filter((item) => item.id !== productId) });
        toast.success("Removed from wishlist");

        try {
          await axios.delete(`/api/wishlist/${productId}`);
        } catch (error) {
          console.error("Failed to remove from wishlist", error);
          toast.error("Failed to sync wishlist");
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
    },
  ),
);
