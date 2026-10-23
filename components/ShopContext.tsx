"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const saved = localStorage.getItem("300vet_cart");

      if (!saved) return [];

      const products: Product[] = JSON.parse(saved);

      return products.map((product) => ({
        ...product,
        quantity: Math.max(1, product.quantity ?? 1),
        selectedForCheckout: product.selectedForCheckout ?? true,
      }));
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const saved = localStorage.getItem("300vet_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("300vet_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("300vet_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Додати товар у кошик
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: (item.quantity ?? 1) + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          selectedForCheckout: true,
        },
      ];
    });
  };

  // Видалити товар лише за явним запитом
  const removeFromCart = (id: string | number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Збільшити кількість
  const increaseQuantity = (id: string | number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
      )
    );
  };

  // Зменшити кількість, але не нижче 1

  const decreaseQuantity = (id: string | number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: (item.quantity ?? 1) - 1,
              }
            : item
        )
        .filter((item) => (item.quantity ?? 1) > 0)
    );
  };

  // Позначити або зняти позначку для покупки
  const toggleCartSelection = (id: string | number) => {
    setCart((prev) =>
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

  // Викликати лише після успішного оформлення замовлення
  const removePurchasedFromCart = (ids: (string | number)[]) => {
    setCart((prev) => prev.filter((item) => !ids.includes(item.id)));
  };

  // Додати або прибрати товар з обраного
  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }

      return [...prev, product];
    });
  };

  const removeFromFavorites = (id: string | number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
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
