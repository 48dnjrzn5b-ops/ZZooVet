"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import CheckoutDialog from "@/components/checkout/CheckoutDialog";
import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useShop } from "@/components/ShopContext";

type CartSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useShop();

  const total = cart.reduce((sum, product) => {
    return sum + product.price * (product.quantity ?? 1);
  }, 0);

  const totalItems = cart.reduce((sum, product) => {
    return sum + (product.quantity ?? 1);
  }, 0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        {/* Заголовок */}
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Кошик
            {totalItems > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({totalItems})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Товари */}
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />

            <p className="text-lg font-medium">Кошик порожній</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Додайте товари, щоб оформити замовлення
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            {cart.map((product) => {
              const quantity = product.quantity ?? 1;
              const productTotal = product.price * quantity;

              return (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-xl border p-3"
                >
                  {/* Фото */}
                  <Link
                    href={`/catalog/product/${product.id}`}
                    onClick={() => onOpenChange(false)}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
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
                      className="line-clamp-2 text-sm font-medium hover:text-[#66852A]"
                    >
                      {product.title}
                    </Link>

                    {/* Ціна */}
                    <p className="mt-1 text-sm font-bold">{productTotal} грн</p>

                    {/* Кількість */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(product.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border transition hover:bg-muted"
                        aria-label="Зменшити кількість"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <span className="min-w-6 text-center text-sm font-medium">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(product.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border transition hover:bg-muted"
                        aria-label="Збільшити кількість"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Видалити */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="self-start text-muted-foreground transition hover:text-red-500"
                    aria-label="Видалити товар"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Нижня частина — завжди видима */}
        <div className="border-t pt-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Разом</span>

            <span className="text-xl font-bold">{total} грн</span>
          </div>

          <button
            type="button"
            disabled={total <= 0}
            onClick={() => {
              if (total <= 0) return;

              onOpenChange(false);
              setIsCheckoutOpen(true);
            }}
            className={`
      w-full
      rounded-xl
      px-7
      py-3
      text-sm
      font-semibold
      text-white
      transition
      ${
        total <= 0
          ? "cursor-not-allowed bg-gray-300"
          : "bg-[#66852A] hover:bg-[#587522]"
      }
    `}
          >
            Оформити замовлення
          </button>
        </div>
      </SheetContent>
      <CheckoutDialog
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </Sheet>
  );
}
