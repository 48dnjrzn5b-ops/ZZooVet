"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Heart, Menu, Search, ShoppingCart, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CartSheet from "@/components/cart/CartSheet";

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="w-full">
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1400px]
          flex-col
          gap-3
          px-4
          py-3
          sm:px-6
          lg:flex-row
          lg:items-center
          lg:gap-4
          lg:px-8
          lg:py-4
        "
      >
        {/* ==================== */}
        {/* Mobile top row */}
        {/* ==================== */}

        <div
          className="
            flex
            w-full
            items-center
            justify-between
            lg:hidden
          "
        >
          {/* Burger */}

          <Button
            variant="ghost"
            size="icon"
            className="
              h-10
              w-10
              shrink-0
              rounded-full
              bg-muted
              text-foreground
              hover:bg-primary/10
            "
            aria-label="Меню"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}

          <Link
            href="/"
            aria-label="300VetСвіт"
            className="
              flex
              items-center
              gap-2
            "
          >
            <Image
              src="/logo.png"
              alt="300VetСвіт"
              width={45}
              height={45}
              className="
                h-10
                w-10
                object-contain
              "
            />

            <span
              className="
                whitespace-nowrap
                font-heading
                text-xl
                font-bold
                leading-none
                tracking-tight
              "
            >
              <span className="text-secondary">300</span>
              <span className="text-primary">Vet</span>
              <span className="text-accent">Світ</span>
            </span>
          </Link>

          {/* Mobile actions */}

          <div className="ml-auto flex items-center gap-0.5">
            {/* Account */}

            <Link
              href="/login"
              aria-label="Акаунт"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-foreground
                transition-colors
                hover:bg-muted
              "
            >
              <UserRound className="h-5 w-5" />
            </Link>

            {/* Favorites */}

            <Link
              href="/favorites"
              aria-label="Обране"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-foreground
                transition-colors
                hover:bg-muted
              "
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart */}

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Кошик"
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-foreground
                transition-colors
                hover:bg-muted
              "
            >
              <ShoppingCart className="h-5 w-5" />

              <span
                className="
                  absolute
                  -right-0.5
                  -top-0.5
                  flex
                  h-4
                  min-w-4
                  items-center
                  justify-center
                  rounded-full
                  bg-secondary
                  px-1
                  text-[0.6rem]
                  font-bold
                  leading-none
                  text-secondary-foreground
                "
              >
                2
              </span>
            </button>
          </div>
        </div>

        {/* ==================== */}
        {/* Desktop Logo */}
        {/* ==================== */}

        <Link
          href="/"
          aria-label="300VetСвіт"
          className="
            hidden
            shrink-0
            items-center
            gap-2
            lg:flex
          "
        >
          <Image
            src="/logo.png"
            alt="300VetСвіт"
            width={70}
            height={70}
            className="
              h-[clamp(2.75rem,5vw,4.25rem)]
              w-[clamp(2.75rem,5vw,4.25rem)]
              object-contain
            "
          />

          <span
            className="
              whitespace-nowrap
              font-heading
              text-[clamp(1.25rem,2.2vw,1.875rem)]
              font-bold
              leading-none
              tracking-tight
            "
          >
            <span className="text-secondary">300</span>
            <span className="text-primary">Vet</span>
            <span className="text-accent">Світ</span>
          </span>
        </Link>

        {/* ==================== */}
        {/* Search */}
        {/* ==================== */}

        <div
          className="
            relative
            order-last
            w-full
            lg:order-none
            lg:min-w-0
            lg:flex-1
          "
        >
          <Search
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              z-10
              h-5
              w-5
              -translate-y-1/2
              text-muted-foreground
              sm:left-5
              sm:h-5
              sm:w-5
              lg:h-6
              lg:w-6
            "
          />

          <Input
            type="search"
            placeholder="Пошук товарів..."
            className="
              h-11
              w-full
              rounded-xl
              border-border
              bg-background
              pl-11
              pr-4
              text-sm
              shadow-none
              placeholder:text-muted-foreground
              focus-visible:border-primary
              focus-visible:ring-primary/20
              sm:h-12
              sm:pl-12
              sm:text-base
              lg:h-14
              lg:pl-14
            "
          />
        </div>

        {/* ==================== */}
        {/* Desktop Actions */}
        {/* ==================== */}

        <div
          className="
            hidden
            shrink-0
            items-center
            gap-[clamp(0.75rem,1.5vw,1.5rem)]
            lg:flex
          "
        >
          {/* Login */}

          <Link
            href="/login"
            className="
              flex
              items-center
              gap-2
              whitespace-nowrap
              text-[clamp(0.8rem,1vw,0.95rem)]
              font-medium
              text-foreground
              transition-colors
              hover:text-primary
            "
          >
            <UserRound
              className="
                h-[clamp(1.25rem,1.8vw,1.75rem)]
                w-[clamp(1.25rem,1.8vw,1.75rem)]
              "
            />

            <span>Увійти</span>
          </Link>

          {/* Favorites */}

          <Link
            href="/favorites"
            className="
              flex
              items-center
              gap-2
              whitespace-nowrap
              text-[clamp(0.8rem,1vw,0.95rem)]
              font-medium
              text-foreground
              transition-colors
              hover:text-primary
            "
          >
            <Heart
              className="
                h-[clamp(1.25rem,1.8vw,1.75rem)]
                w-[clamp(1.25rem,1.8vw,1.75rem)]
              "
            />

            <span>Обране</span>
          </Link>

          {/* Cart */}

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="
              relative
              flex
              items-center
              gap-2
              whitespace-nowrap
              text-[clamp(0.8rem,1vw,0.95rem)]
              font-medium
              text-foreground
              transition-colors
              hover:text-primary
            "
          >
            <div className="relative">
              <ShoppingCart
                className="
                  h-[clamp(1.25rem,1.8vw,1.75rem)]
                  w-[clamp(1.25rem,1.8vw,1.75rem)]
                "
              />

              <span
                className="
                  absolute
                  -right-2
                  -top-2
                  flex
                  h-4
                  min-w-4
                  items-center
                  justify-center
                  rounded-full
                  bg-secondary
                  px-1
                  text-[0.6rem]
                  font-bold
                  leading-none
                  text-secondary-foreground
                  sm:h-5
                  sm:min-w-5
                  sm:text-xs
                "
              >
                2
              </span>
            </div>

            <span>Кошик</span>
          </button>
        </div>
      </div>

      {/* ==================== */}
      {/* Cart Sheet */}
      {/* ==================== */}

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
