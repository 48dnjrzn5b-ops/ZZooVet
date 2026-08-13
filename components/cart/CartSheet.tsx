"use client";

import { ShoppingCart } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type CartSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="
          flex
          w-full
          flex-col
          sm:max-w-md
        "
      >
        {/* Заголовок */}
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Кошик
          </SheetTitle>
        </SheetHeader>

        {/* Товари */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <ShoppingCart
            className="
              mb-4
              h-12
              w-12
              text-muted-foreground
            "
          />

          <p className="text-lg font-medium">Кошик порожній</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Додайте товари, щоб оформити замовлення
          </p>
        </div>

        {/* Нижня частина */}
        <div className="border-t pt-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Разом</span>

            <span className="text-xl font-bold">0 грн</span>
          </div>

          <button
            type="button"
            disabled
            className="
              w-full
              rounded-xl
              bg-[#66852A]
              px-4
              py-3
              text-sm
              font-medium
              text-white
              opacity-50
            "
          >
            Оформити замовлення
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
