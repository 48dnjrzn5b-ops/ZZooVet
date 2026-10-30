"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";

export type Product = {
  id: string | number;
  title: string;
  name?: string;
  image: string;
  price: number;
  oldPrice?: number;
  quantity?: number;
  selectedForCheckout?: boolean;
};

type ShopContextType = {
  cart: Product[];
  favorites: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string | number) => void;
  increaseQuantity: (id: string | number) => void;
  decreaseQuantity: (id: string | number) => void;
  toggleCartSelection: (id: string | number) => void;
  removePurchasedFromCart: (ids: (string | number)[]) => void;
  toggleFavorite: (product: Product) => void;
  removeFromFavorites: (id: string | number) => void;
  isInFavorites: (id: string | number) => boolean;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const CART_KEY = "300vet_cart";
const FAVORITES_KEY = "300vet_favorites";

let cartSnapshot: Product[] = [];
let favoritesSnapshot: Product[] = [];

const listeners = new Set<() => void>();

function readStorage(key: string): Product[] {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getCartSnapshot() {
  return cartSnapshot;
}

function getFavoritesSnapshot() {
  return favoritesSnapshot;
}

const EMPTY_PRODUCTS: Product[] = [];

function getServerSnapshot(): Product[] {
  return EMPTY_PRODUCTS;
}

function updateCart(updater: (previous: Product[]) => Product[]) {
  cartSnapshot = updater(cartSnapshot);
  localStorage.setItem(CART_KEY, JSON.stringify(cartSnapshot));
  notify();
}

function updateFavorites(updater: (previous: Product[]) => Product[]) {
  favoritesSnapshot = updater(favoritesSnapshot);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesSnapshot));
  notify();
}

function initializeStorage() {
  if (typeof window === "undefined") return;

  cartSnapshot = readStorage(CART_KEY).map((product) => ({
    ...product,
    quantity: Math.max(1, product.quantity ?? 1),
    selectedForCheckout: product.selectedForCheckout ?? true,
  }));

  favoritesSnapshot = readStorage(FAVORITES_KEY);
}

if (typeof window !== "undefined") {
  initializeStorage();
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const cart = useSyncExternalStore(
    subscribe,
    getCartSnapshot,
    getServerSnapshot
  );

  const favorites = useSyncExternalStore(
    subscribe,
    getFavoritesSnapshot,
    getServerSnapshot
  );

  const addToCart = (product: Product) => {
    updateCart((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity ?? 1) + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1, selectedForCheckout: true }];
    });
  };

  const removeFromCart = (id: string | number) => {
    updateCart((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id: string | number) => {
    updateCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: string | number) => {
    updateCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity ?? 1) - 1 }
            : item
        )
        .filter((item) => (item.quantity ?? 1) > 0)
    );
  };

  const toggleCartSelection = (id: string | number) => {
    updateCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              selectedForCheckout: !(item.selectedForCheckout ?? true),
            }
          : item
      )
    );
  };

  const removePurchasedFromCart = (ids: (string | number)[]) => {
    updateCart((prev) => prev.filter((item) => !ids.includes(item.id)));
  };

  const toggleFavorite = (product: Product) => {
    updateFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      return exists
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product];
    });
  };

  const removeFromFavorites = (id: string | number) => {
    updateFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const isInFavorites = (id: string | number) => {
    return favorites.some((item) => item.id === id);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        favorites,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        toggleCartSelection,
        removePurchasedFromCart,
        toggleFavorite,
        removeFromFavorites,
        isInFavorites,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }

  return context;
}
