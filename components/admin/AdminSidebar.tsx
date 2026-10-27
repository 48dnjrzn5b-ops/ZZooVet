"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LogOut,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Settings,
} from "lucide-react";

const navigation = [
  { href: "/admin", label: "Огляд", icon: LayoutDashboard },
  { href: "/admin/products", label: "Товари", icon: Package },
  { href: "/admin/orders", label: "Замовлення", icon: ShoppingCart },
  { href: "/admin/users", label: "Користувачі", icon: Users },
  { href: "/admin/categories", label: "Категорії", icon: FolderTree },
  { href: "/admin/settings", label: "Налаштування", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function loadNewOrdersCount() {
      const { count, error } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "new");

      if (cancelled) return;

      if (error) {
        console.error(
          "Не вдалося завантажити кількість нових замовлень:",
          error
        );
        return;
      }

      setNewOrdersCount(count ?? 0);
    }

    void loadNewOrdersCount();

    const channel = supabase
      .channel("admin-new-orders-count")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          void loadNewOrdersCount();
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Помилка виходу:", error.message);
      return;
    }

    window.dispatchEvent(new Event("open-login"));
    router.push("/");
  }

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-[#4A3528] p-6 text-white">
      <Link href="/admin" className="mb-10 block">
        <div className="text-2xl font-bold">🐾 ЗООVet Світ</div>
        <p className="mt-1 text-sm text-white/60">Панель адміністратора</p>
      </Link>

      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/80 hover:translate-x-1 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={20} />

              <span className="flex-1">{item.label}</span>

              {item.href === "/admin/orders" && newOrdersCount > 0 && (
                <span className="min-w-6 rounded-full bg-red-600 px-2 py-0.5 text-center text-xs font-bold text-white">
                  {newOrdersCount > 99 ? "99+" : newOrdersCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-8 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-white/80 transition hover:translate-x-1 hover:bg-white/10 hover:text-white"
      >
        <LogOut size={20} />
        <span>Вийти</span>
      </button>
    </aside>
  );
}
