"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

type ProductCardProps = {
  id: string | number;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: number;
};

export default function ProductCard({
  id,
  name,
  image,
  price,
  oldPrice,
  discount,
}: ProductCardProps) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-background
        p-4
        transition
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      {/* Обране */}
      <button
        type="button"
        aria-label="Додати в обране"
        className="
          absolute
          right-3
          top-3
          z-10
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-white
          text-muted-foreground
          shadow-sm
          transition
          hover:text-red-500
        "
      >
        <Heart className="h-5 w-5" />
      </button>

      {/* Знижка */}
      {discount && (
        <span
          className="
            absolute
            left-3
            top-3
            z-10
            rounded-md
            bg-red-500
            px-2
            py-1
            text-xs
            font-semibold
            text-white
          "
        >
          -{discount}%
        </span>
      )}

      {/* Клік по товару */}
      <Link href={`/product/${id}`}>
        {/* Картинка */}
        <div
          className="
            relative
            mb-4
            aspect-square
            overflow-hidden
            rounded-xl
            bg-[#F8F3EC]
          "
        >
          <Image
            src={image}
            alt={name}
            fill
            className="
              object-contain
              p-4
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />
        </div>

        {/* Назва */}
        <h3
          className="
            min-h-[3rem]
            text-sm
            font-medium
            leading-6
          "
        >
          {name}
        </h3>

        {/* Ціна */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold">{price} грн</span>

          {oldPrice && (
            <span
              className="
                text-sm
                text-muted-foreground
                line-through
              "
            >
              {oldPrice} грн
            </span>
          )}
        </div>
      </Link>

      {/* Кнопка кошика */}
      <button
        type="button"
        aria-label="Додати в кошик"
        className="
          mt-4
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-[#66852A]
          px-4
          py-2.5
          text-sm
          font-medium
          text-white
          transition
          hover:bg-[#536D22]
        "
      >
        <ShoppingCart className="h-4 w-4" />
        Додати в кошик
      </button>
    </div>
  );
}
