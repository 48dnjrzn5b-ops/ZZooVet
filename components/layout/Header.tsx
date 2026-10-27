"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import {
  ChevronDown,
  Clock,
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";

import { navigation } from "@/data/navigation";
import { catalogCategories } from "@/data/catalogCategories";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CartSheet from "@/components/cart/CartSheet";
import FavoritesSheet from "@/components/cart/FavoritesSheet";
import { useShop } from "@/components/ShopContext";
import AuthModal from "@/components/AuthModal";

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountName, setAccountName] = useState("");

  const router = useRouter();
  const { cart, favorites } = useShop();
  const initials = accountName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase("uk-UA"))
    .join("");

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function checkUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !user) {
        setIsAdmin(false);
        setIsLoggedIn(false);
        setAccountName("");
        setIsAuthChecked(true);
        return;
      }

      setIsLoggedIn(true);
      setIsAdmin(
        user.app_metadata?.role === "admin" ||
          user.user_metadata?.role === "admin"
      );

      const fallbackName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.first_name ||
        "";

      setAccountName(fallbackName);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      if (profileError) {
        console.error("Помилка завантаження імені в Header:", profileError);
      }

      const firstName =
        profile?.first_name || user.user_metadata?.first_name || "";
      const lastName =
        profile?.last_name || user.user_metadata?.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim();

      setAccountName(
        fullName ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "Мій кабінет"
      );

      setIsAuthChecked(true);
    }

    void checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => {
        void checkUser();
      }, 0);
    });

    function handleAuthSuccess() {
      setAuthOpen(false);
      void checkUser();
    }

    function handleOpenLogin() {
      setAuthOpen(true);
    }

    window.addEventListener("auth-success", handleAuthSuccess);
    window.addEventListener("open-login", handleOpenLogin);

    return () => {
      active = false;
      subscription.unsubscribe();
      window.removeEventListener("auth-success", handleAuthSuccess);
      window.removeEventListener("open-login", handleOpenLogin);
    };
  }, []);

  function handleAccountClick() {
    if (!isAuthChecked) return;

    if (isAdmin) {
      router.push("/admin");
    } else if (isLoggedIn) {
      router.push("/account");
    } else {
      setAuthOpen(true);
    }
  }

  return (
    <header className="relative z-50 w-full">
      <div
        className="
          mx-auto flex w-full max-w-[1400px] flex-col gap-3
          px-4 py-3 sm:px-6 lg:flex-row lg:items-center
          lg:gap-4 lg:px-8 lg:py-4
        "
      >
        {/* MOBILE TOP ROW */}
        <div className="flex w-full flex-col gap-2 lg:hidden">
          <div className="flex w-full items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="h-10 w-10 shrink-0 rounded-full bg-muted text-foreground hover:bg-primary/10"
              aria-label="Меню"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            <Link
              href="/"
              aria-label="300VetСвіт"
              className="flex shrink-0 items-center justify-center"
            >
              <Image
                src="/logo.svg"
                alt="300VetСвіт"
                width={50}
                height={50}
                className="h-10 w-10 object-contain"
              />
            </Link>

            <div className="ml-auto flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={handleAccountClick}
                aria-label="Особистий кабінет"
                disabled={!isAuthChecked}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted disabled:opacity-60"
              >
                {isLoggedIn ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF0DF] text-xs font-semibold text-[#66852A]">
                    {initials || "К"}
                  </span>
                ) : (
                  <UserRound className="h-5 w-5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setFavoritesOpen(true)}
                aria-label="Обране"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
              >
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {favorites.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label="Кошик"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#66852A] text-[10px] font-bold text-white">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 rounded-lg bg-muted/40 py-1.5 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-[#66852A]" />
            <span>Графік: Пн-Нд 10:00 - 20:00</span>
          </div>
        </div>

        {/* DESKTOP LOGO */}
        <Link
          href="/"
          aria-label="300VetСвіт"
          className="hidden h-[clamp(3.5rem,6vw,5.5rem)] w-[clamp(3.5rem,6vw,5.5rem)] shrink-0 items-center lg:flex"
        >
          <Image
            src="/logo.svg"
            alt="300VetСвіт"
            width={90}
            height={90}
            className="h-full w-full object-contain"
          />
        </Link>

        {/* DESKTOP CATALOG */}
        <Link
          href="/catalog"
          className="hidden h-14 shrink-0 items-center gap-2 rounded-xl bg-[#66852A] px-6 font-semibold text-white hover:bg-[#A1BB6F] lg:flex"
        >
          <Menu className="h-5 w-5" />
          <span>Каталог товарів</span>
          <ChevronDown className="h-4 w-4" />
        </Link>

        {/* SEARCH */}
        <div className="relative order-last w-full lg:order-none lg:min-w-0 lg:flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground sm:left-5 lg:h-6 lg:w-6" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query = search.trim();
                router.push(
                  query
                    ? `/catalog?search=${encodeURIComponent(query)}`
                    : "/catalog"
                );
              }
            }}
            placeholder="Пошук товарів..."
            className="h-11 w-full rounded-xl border-border bg-background pl-11 pr-4 text-sm shadow-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20 sm:h-12 sm:pl-12 sm:text-base lg:h-14 lg:pl-14"
          />
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden shrink-0 items-center gap-[clamp(0.75rem,1.2vw,1.25rem)] lg:flex">
          <div className="flex items-center gap-2 whitespace-nowrap text-[clamp(0.75rem,0.95vw,0.9rem)] font-medium text-muted-foreground">
            <Clock className="h-[clamp(1.15rem,1.6vw,1.5rem)] w-[clamp(1.15rem,1.6vw,1.5rem)] text-[#66852A]" />
            <span>Пн-Нд: 10:00 - 20:00</span>
          </div>

          <a
            href="tel:+380991234567"
            className="flex items-center gap-2 whitespace-nowrap text-[clamp(0.8rem,1vw,0.95rem)] font-medium text-foreground transition-colors hover:text-[#66852A]"
          >
            <Phone className="h-[clamp(1.25rem,1.8vw,1.75rem)] w-[clamp(1.25rem,1.8vw,1.75rem)] text-[#66852A]" />
            <span>+38 099 123 45 67</span>
          </a>

          <button
            type="button"
            onClick={handleAccountClick}
            disabled={!isAuthChecked}
            className="flex max-w-[200px] items-center gap-2 whitespace-nowrap text-[clamp(0.8rem,1vw,0.95rem)] font-medium text-foreground transition-colors hover:text-primary disabled:opacity-60"
          >
            <UserRound className="h-[clamp(1.25rem,1.8vw,1.75rem)] w-[clamp(1.25rem,1.8vw,1.75rem)] shrink-0" />
            <span className="max-w-[150px] truncate">
              {!isAuthChecked
                ? "Завантаження..."
                : isAdmin
                ? "Адмінпанель"
                : isLoggedIn
                ? accountName || "Мій кабінет"
                : "Увійти"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFavoritesOpen(true)}
            className="relative flex items-center gap-2 whitespace-nowrap text-[clamp(0.8rem,1vw,0.95rem)] font-medium text-foreground transition-colors hover:text-primary"
          >
            <div className="relative flex items-center">
              <Heart className="h-[clamp(1.25rem,1.8vw,1.75rem)] w-[clamp(1.25rem,1.8vw,1.75rem)]" />
              {favorites.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </div>
            <span>Обране</span>
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 whitespace-nowrap text-[clamp(0.8rem,1vw,0.95rem)] font-medium text-foreground transition-colors hover:text-primary"
          >
            <div className="relative flex items-center">
              <ShoppingCart className="h-[clamp(1.25rem,1.8vw,1.75rem)] w-[clamp(1.25rem,1.8vw,1.75rem)]" />
              {cart.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#66852A] text-[10px] font-bold text-white">
                  {cart.length}
                </span>
              )}
            </div>
            <span>Кошик</span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="absolute left-0 top-full z-[100] w-full border-t border-border bg-background shadow-xl lg:hidden">
          <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
            <button
              type="button"
              onClick={() => setMobileCatalogOpen((prev) => !prev)}
              className="flex w-full items-center justify-between border-b border-border px-5 py-4 text-left text-base font-semibold text-foreground"
            >
              <span className="flex items-center gap-3">
                <Menu className="h-5 w-5 text-[#66852A]" />
                Каталог товарів
              </span>
              <ChevronDown
                className={`h-5 w-5 transition-transform duration-200 ${
                  mobileCatalogOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileCatalogOpen && (
              <div className="bg-muted/30">
                {Object.entries(catalogCategories).map(
                  ([categorySlug, category]) => (
                    <MobileCategory
                      key={categorySlug}
                      categorySlug={categorySlug}
                      category={category}
                      onNavigate={() => setMobileMenuOpen(false)}
                    />
                  )
                )}

                <Link
                  href="/catalog/sale"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mx-4 my-3 flex items-center justify-center rounded-lg bg-[#F77601] px-4 py-3 text-sm font-semibold text-white"
                >
                  Акції
                </Link>
              </div>
            )}

            <div className="border-t border-border">
              {navigation
                .filter((item) => item.href !== "/catalog")
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block border-b border-border px-5 py-4 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {item.title}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}

      <FavoritesSheet open={favoritesOpen} onOpenChange={setFavoritesOpen} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}

function MobileCategory({
  categorySlug,
  category,
  onNavigate,
}: {
  categorySlug: string;
  category: {
    title: string;
    subcategories: {
      slug: string;
      title: string;
    }[];
  };
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasSubcategories = category.subcategories.length > 0;

  return (
    <div className="border-b border-border">
      <div className="flex items-center">
        <Link
          href={`/catalog/${categorySlug}`}
          onClick={onNavigate}
          className="flex-1 px-7 py-3.5 text-sm font-medium text-foreground"
        >
          {category.title}
        </Link>

        {hasSubcategories && (
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={`Відкрити ${category.title}`}
            className="flex h-12 w-12 items-center justify-center text-muted-foreground"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {open && hasSubcategories && (
        <div className="bg-background px-7 pb-3">
          {category.subcategories.map((subcategory) => (
            <Link
              key={subcategory.slug}
              href={`/catalog/${categorySlug}?subcategory=${subcategory.slug}`}
              onClick={onNavigate}
              className="block py-2 text-sm text-muted-foreground transition-colors hover:text-[#66852A]"
            >
              {subcategory.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
