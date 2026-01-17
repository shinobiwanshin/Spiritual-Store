"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";

export interface CartProduct {
  id: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartProduct[];
  isOpen: boolean;
  isLoading: boolean;
  isSynced: boolean;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (product: Omit<CartProduct, "quantity">) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  syncCartOnLogin: () => Promise<void>;

  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Helper to map server cart item to CartProduct
function mapServerItemToCartProduct(item: any): CartProduct {
  return {
    id: item.product.id,
    title: item.product.title,
    price: item.product.price,
    image: item.product.images?.[0] || "",
    quantity: item.quantity,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      isSynced: false,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const response = await axios.get("/api/cart");
          if (response.data && Array.isArray(response.data)) {
            const cartProducts: CartProduct[] = response.data.map(
              mapServerItemToCartProduct,
            );
            set({ items: cartProducts, isSynced: true });
          } else {
            set({ items: [], isSynced: true });
          }
        } catch (error) {
          console.error("Failed to fetch cart", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === product.id,
        );

        // Optimistic update
        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
        }

        // Sync with server if user is authenticated
        try {
          await axios.post("/api/cart", { productId: product.id, quantity: 1 });
        } catch (error: any) {
          // If unauthorized (401), keep local state only
          if (error?.response?.status !== 401) {
            console.error("Failed to sync cart", error);
            // Revert on other errors
            set({ items: currentItems });
          }
        }
      },

      removeItem: async (productId) => {
        const currentItems = get().items;

        // Optimistic update
        set({ items: currentItems.filter((item) => item.id !== productId) });

        try {
          await axios.delete(`/api/cart/${productId}`);
        } catch (error: any) {
          if (error?.response?.status !== 401) {
            console.error("Failed to sync cart removal", error);
            set({ items: currentItems });
          }
        }
      },

      updateQuantity: async (productId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(productId);
          return;
        }

        const currentItems = get().items;

        // Optimistic update
        set({
          items: currentItems.map((item) =>
            item.id === productId ? { ...item, quantity } : item,
          ),
        });

        try {
          await axios.put("/api/cart", { productId, quantity });
        } catch (error: any) {
          if (error?.response?.status !== 401) {
            console.error("Failed to sync quantity update", error);
            set({ items: currentItems });
          }
        }
      },

      clearCart: async () => {
        const currentItems = get().items;
        set({ items: [] });

        try {
          await axios.delete("/api/cart");
        } catch (error: any) {
          if (error?.response?.status !== 401) {
            console.error("Failed to clear cart on server", error);
            set({ items: currentItems });
          }
        }
      },

      toggleCart: () => set({ isOpen: !get().isOpen }),

      syncCartOnLogin: async () => {
        const localItems = get().items;

        try {
          const response = await axios.get("/api/cart");
          const serverItems: CartProduct[] = Array.isArray(response.data)
            ? response.data.map(mapServerItemToCartProduct)
            : [];

          // Merge: Server items take priority, then add local items not on server
          const mergedItems: CartProduct[] = [...serverItems];
          const localOnlyItems = localItems.filter(
            (local) => !serverItems.some((server) => server.id === local.id),
          );

          // Sync local-only items to server in parallel
          const syncResults = await Promise.allSettled(
            localOnlyItems.map((localItem) =>
              axios.post("/api/cart", {
                productId: localItem.id,
                quantity: localItem.quantity,
              }),
            ),
          );

          // Add successfully synced items to merged list
          syncResults.forEach((result, index) => {
            if (result.status === "fulfilled") {
              mergedItems.push(localOnlyItems[index]);
            } else {
              // Keep failed items in local state (will retry on next sync)
              mergedItems.push(localOnlyItems[index]);
              console.error(
                `Failed to sync item ${localOnlyItems[index].id}`,
                result.reason,
              );
            }
          });

          set({ items: mergedItems, isSynced: true });

          // Notify user if local items were synced
          if (localOnlyItems.length > 0) {
            toast.success("Cart synced with your account");
          }
        } catch (error) {
          console.error("Failed to sync cart on login", error);
        }
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.price.replace(/[₹,]/g, ""));
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: "astra-cart",
      // Don't persist loading/sync state
      partialize: (state) => ({
        items: state.items,
        isOpen: state.isOpen,
      }),
    },
  ),
);
