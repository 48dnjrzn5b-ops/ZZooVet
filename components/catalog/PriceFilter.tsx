"use client";

import { useState } from "react";

type PriceFilterProps = {
  minPrice: number | null;
  maxPrice: number | null;
  onApply: (minPrice: number | null, maxPrice: number | null) => void;
};

export default function PriceFilter({
  minPrice: appliedMin,
  maxPrice: appliedMax,
  onApply,
}: PriceFilterProps) {
  const [minPrice, setMinPrice] = useState(
    appliedMin === null ? "" : String(appliedMin)
  );
  const [maxPrice, setMaxPrice] = useState(
    appliedMax === null ? "" : String(appliedMax)
  );
  const [error, setError] = useState("");

  function handleApply() {
    const min = minPrice.trim() === "" ? null : Number(minPrice);
    const max = maxPrice.trim() === "" ? null : Number(maxPrice);

    if (
      (min !== null && (!Number.isFinite(min) || min < 0)) ||
      (max !== null && (!Number.isFinite(max) || max < 0))
    ) {
      setError("Введіть коректну невід’ємну ціну.");
      return;
    }

    if (min !== null && max !== null && min > max) {
      setError("Мінімальна ціна не може бути більшою за максимальну.");
      return;
    }

    setError("");
    onApply(min, max);
  }

  return (
    <div className="mt-6 border-t border-border pt-5">
      <h3 className="mb-4 text-sm font-semibold">Ціна</h3>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
          placeholder="від"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
        />

        <span className="text-muted-foreground">—</span>

        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          placeholder="до"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleApply}
        className="mt-3 w-full rounded-lg bg-[#C9A227] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Застосувати
      </button>
    </div>
  );
}
