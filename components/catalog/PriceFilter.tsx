"use client";

import { useState } from "react";

export default function PriceFilter() {
  // Мінімальна ціна
  const [minPrice, setMinPrice] = useState("");

  // Максимальна ціна
  const [maxPrice, setMaxPrice] = useState("");

  return (
    <div className="mt-6 border-t border-border pt-5">
      {/* Назва фільтра */}
      <h3 className="mb-4 text-sm font-semibold">Ціна</h3>

      {/* Поля ціни */}
      <div className="flex items-center gap-2">
        {/* Від */}
        <input
          type="number"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
          placeholder="від"
          className="
            w-full
            rounded-lg
            border
            border-border
            bg-background
            px-3
            py-2
            text-sm
            outline-none
            focus:border-[#C9A227]
          "
        />

        <span className="text-muted-foreground">—</span>

        {/* До */}
        <input
          type="number"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          placeholder="до"
          className="
            w-full
            rounded-lg
            border
            border-border
            bg-background
            px-3
            py-2
            text-sm
            outline-none
            focus:border-[#C9A227]
          "
        />
      </div>

      {/* Кнопка */}
      <button
        type="button"
        className="
          mt-3
          w-full
          rounded-lg
          bg-[#C9A227]
          px-4
          py-2
          text-sm
          font-medium
          text-white
          transition
          hover:opacity-90
        "
      >
        Застосувати
      </button>
    </div>
  );
}
