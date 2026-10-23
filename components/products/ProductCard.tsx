"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useShop, Product } from "@/components/ShopContext";

interface ProductCardProps {
  product?: {
    id: string | number;
    title?: string;
    name?: string;
    price: number;
    image: string;
    oldPrice?: number;
    stock_quantity?: number;
    availability?: string;
  };

  id?: string | number;
  title?: string;
  name?: string;
  price?: number;
  image?: string;
  oldPrice?: number;
  stock_quantity?: number;
  availability?: string;
}

export default function ProductCard(props: ProductCardProps) {
  const { cart, favorites, addToCart, toggleFavorite } = useShop();

  const productData = props.product || props;

  const id = productData.id;
  const title = productData.title || productData.name || "Товар";
  const price = productData.price ?? 0;
  const image = productData.image || "";
  const oldPrice = productData.oldPrice;
  const stockQuantity = productData.stock_quantity;
  const availability = productData.availability;

  const isAvailable =
    stockQuantity !== undefined
      ? stockQuantity > 0
      : availability?.toLowerCase() !== "немає в наявності";

  const isSale = oldPrice !== undefined && oldPrice > price;

  const discount = isSale
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const formattedProduct: Product = {
    id: id || "",
    title,
    price,
    image,
    oldPrice,
  };

  const isFavorite = favorites.some((item) => item.id === id);
  const isInCart = cart.some((item) => item.id === id);

  return (
    <div className="group relative flex h-full w-full flex-col rounded-2xl border border-border bg-background p-3 shadow-sm sm:p-4">
      <button
        type="button"
        onClick={() => toggleFavorite(formattedProduct)}
        aria-label="В обране"
        className={`
          absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center
          rounded-full bg-background/80 shadow transition-colors
          ${
            isFavorite
              ? "text-red-500 hover:text-red-600"
              : "text-muted-foreground hover:text-foreground"
          }
        `}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
      </button>

      <Link
        href={`/product/${id}`}
        className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-muted"
      >
        {image ? (
          <Image src={image} alt={title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Немає фото
          </div>
        )}
      </Link>

      <Link
        href={`/product/${id}`}
        className="mb-2 line-clamp-2 flex-1 font-medium text-foreground hover:text-[#66852A]"
      >
        {title}
      </Link>

      <div className="mt-auto border-t border-border pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-lg font-bold ${
              isAvailable ? "text-foreground" : "text-gray-400"
            }`}
          >
            {price} грн
          </span>

          {isSale && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {oldPrice} грн
              </span>

              <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                -{discount}%
              </span>
            </>
          )}
        </div>

        {isAvailable ? (
          <button
            type="button"
            onClick={() => addToCart(formattedProduct)}
            className={`
              mt-3 flex w-full items-center justify-center gap-1.5
              rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors
              ${
                isInCart
                  ? "bg-muted text-foreground hover:bg-muted/80"
                  : "bg-[#66852A] text-white hover:bg-[#A1BB6F]"
              }
            `}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isInCart ? "У кошику" : "В кошик"}</span>
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="mt-3 flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-400"
          >
            Немає в наявності
          </button>
        )}
      </div>
    </div>
  );
}
