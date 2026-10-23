"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingCart } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useShop } from "@/components/ShopContext";

type FavoritesSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FavoritesSheet({
  open,
  onOpenChange,
}: FavoritesSheetProps) {
  const { favorites, removeFromFavorites, addToCart, cart } = useShop();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        {/* Заголовок */}
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Обране
            {favorites.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({favorites.length})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Порожнє обране */}
        {favorites.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <Heart className="mb-4 h-12 w-12 text-muted-foreground" />

            <p className="text-lg font-medium">Обране порожнє</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Додавайте товари, натискаючи на сердечко
            </p>

            <Link
              href="/catalog"
              onClick={() => onOpenChange(false)}
              className="
                mt-6
                rounded-xl
                bg-[#66852A]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#587522]
              "
            >
              Перейти до каталогу
            </Link>
          </div>
        ) : (
          /* Товари */
          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            {favorites.map((product) => {
              const isInCart = cart.some((item) => item.id === product.id);

              return (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-xl border p-3"
                >
                  {/* Фото */}
                  <Link
                    href={`/catalog/product/${product.id}`}
                    onClick={() => onOpenChange(false)}
                    className="
                      relative
                      h-20
                      w-20
                      shrink-0
                      overflow-hidden
                      rounded-lg
                      bg-muted
                    "
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        Немає фото
                      </div>
                    )}
                  </Link>

                  {/* Інформація */}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/catalog/product/${product.id}`}
                      onClick={() => onOpenChange(false)}
                      className="
                        line-clamp-2
                        text-sm
                        font-medium
                        transition
                        hover:text-[#66852A]
                      "
                    >
                      {product.title}
                    </Link>

                    <p className="mt-2 font-bold">{product.price} грн</p>

                    {/* В кошик */}
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      disabled={isInCart}
                      className={`
                        mt-2
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        transition
                        ${
                          isInCart
                            ? "bg-muted text-muted-foreground"
                            : "bg-[#66852A] text-white hover:bg-[#587522]"
                        }
                      `}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />

                      {isInCart ? "У кошику" : "В кошик"}
                    </button>
                  </div>

                  {/* Видалити */}
                  <button
                    type="button"
                    onClick={() => removeFromFavorites(product.id)}
                    className="
                      self-start
                      text-muted-foreground
                      transition
                      hover:text-red-500
                    "
                    aria-label="Видалити з обраного"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
