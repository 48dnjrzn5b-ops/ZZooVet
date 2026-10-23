"use client";

import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/components/ShopContext";

type ProductActionsProps = {
  product: {
    id: string | number;
    title: string;
    image: string;
    price: number;
    oldPrice?: number;
  };
};

export default function ProductActions({ product }: ProductActionsProps) {
  const { addToCart, increaseQuantity, toggleFavorite, isInFavorites } =
    useShop();

  const [quantity, setQuantity] = useState(1);

  const favorite = isInFavorites(product.id);

  const decrease = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increase = () => {
    setQuantity((current) => current + 1);
  };

  const handleAddToCart = () => {
    // Додаємо товар у кошик
    addToCart(product);

    // Якщо вибрано більше 1 штуки —
    // збільшуємо кількість у кошику
    for (let i = 1; i < quantity; i++) {
      increaseQuantity(product.id);
    }
  };

  const handleFavorite = () => {
    toggleFavorite(product);
  };

  return (
    <div className="mt-6">
      {/* КІЛЬКІСТЬ + КОШИК + ОБРАНЕ */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Кількість */}
        <div className="flex h-14 items-center justify-between rounded-xl border border-gray-200 px-4 sm:w-36">
          <button
            type="button"
            onClick={decrease}
            className="text-gray-500 transition hover:text-[#66852A]"
            aria-label="Зменшити кількість"
          >
            <Minus size={18} />
          </button>

          <span className="min-w-8 text-center font-medium text-gray-900">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increase}
            className="text-gray-500 transition hover:text-[#66852A]"
            aria-label="Збільшити кількість"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Додати в кошик */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex h-14 flex-1 items-center justify-center gap-3 rounded-xl bg-[#66852A] px-6 font-medium text-white transition hover:bg-[#587522]"
        >
          <ShoppingCart size={20} />

          <span>Додати в кошик</span>
        </button>

        {/* Обране */}
        <button
          type="button"
          onClick={handleFavorite}
          className={`flex h-14 w-full shrink-0 items-center justify-center rounded-xl border transition sm:w-14 ${
            favorite
              ? "border-[#66852A] bg-[#66852A] text-white"
              : "border-gray-200 text-gray-700 hover:border-[#66852A] hover:text-[#66852A]"
          }`}
          aria-label={favorite ? "Видалити з обраного" : "Додати в обране"}
        >
          <Heart size={21} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Повідомлення */}
      <div className="mt-3 text-sm text-gray-500">
        {favorite
          ? "Товар додано до обраного"
          : "Можна додати товар до обраного"}
      </div>
    </div>
  );
}
