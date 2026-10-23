"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

type OrderItem = {
  id?: string;
  name?: string;
  quantity?: number;
};

type Order = {
  id: string;
  order_number: number;
  customer_name: string;
  items: OrderItem[] | null;
  total: number;
  status: string;
  created_at: string;
};

const orderStatuses = [
  { value: "new", label: "Нові", color: "text-orange-600", icon: Clock },
  {
    value: "processing",
    label: "В обробці",
    color: "text-blue-600",
    icon: Package,
  },
  {
    value: "shipped",
    label: "Відправлені",
    color: "text-purple-600",
    icon: Truck,
  },
  {
    value: "completed",
    label: "Виконані",
    color: "text-green-600",
    icon: CheckCircle2,
  },
  {
    value: "cancelled",
    label: "Скасовані",
    color: "text-red-600",
    icon: XCircle,
  },
];

const statusLabels: Record<string, string> = {
  new: "Нове",
  processing: "В обробці",
  shipped: "Відправлено",
  completed: "Виконано",
  cancelled: "Скасовано",
};

const statusColors: Record<string, string> = {
  new: "text-orange-600",
  processing: "text-blue-600",
  shipped: "text-purple-600",
  completed: "text-green-600",
  cancelled: "text-red-600",
};

const cardClass =
  "block rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg";

export default function AdminPage() {
  const [productsCount, setProductsCount] = useState<number | null>(null);
  const [categoriesCount, setCategoriesCount] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStatistics() {
      const supabase = createClient();

      const { count, error } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true);

      if (error) {
        console.error("Помилка підрахунку товарів:", error.message);
      } else {
        setProductsCount(count ?? 0);
      }

      const { data, error: categoriesError } = await supabase
        .from("products")
        .select("category")
        .eq("is_active", true);

      if (categoriesError) {
        console.error("Помилка підрахунку категорій:", categoriesError.message);
      } else {
        const categories = new Set(
          (data ?? [])
            .map((product) => product.category?.trim())
            .filter((category) => Boolean(category))
        );

        setCategoriesCount(categories.size);
      }
    }

    async function loadOrders() {
      try {
        const response = await fetch("/api/orders/admin", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Не вдалося завантажити замовлення");
        }

        const data: { orders?: Order[] } = await response.json();

        setOrders(data.orders ?? []);
        setOrdersError("");
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Помилка завантаження замовлень:", error);
        setOrdersError("Не вдалося завантажити замовлення.");
      } finally {
        if (!controller.signal.aborted) {
          setOrdersLoading(false);
        }
      }
    }

    void loadStatistics();
    void loadOrders();

    return () => controller.abort();
  }, []);

  const money = (amount: number) =>
    new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-[#F7F5EF] p-4 text-[#4A3528] sm:p-6 lg:p-8">
      {" "}
      <div className="mb-8">
        {" "}
        <h1 className="text-3xl font-bold">Панель адміністратора</h1>{" "}
        <p className="mt-2 text-gray-600">
          Керуйте товарами, замовленнями та користувачами магазину.{" "}
        </p>{" "}
      </div>
      ```
      {/* ОСНОВНІ КАРТКИ */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Link href="/admin/products" className={cardClass}>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Товари</span>
            <Package size={22} className="text-[#66852A]" />
          </div>
          <div className="text-3xl font-bold">
            {productsCount === null
              ? "…"
              : productsCount.toLocaleString("uk-UA")}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            активних товарів у каталозі
          </p>
        </Link>

        <Link href="/admin/orders" className={cardClass}>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Замовлення</span>
            <ShoppingCart size={22} className="text-[#66852A]" />
          </div>
          <div className="text-3xl font-bold">
            {ordersLoading ? "…" : ordersError ? "—" : orders.length}
          </div>
          <p className="mt-1 text-sm text-gray-500">усіх замовлень у системі</p>
        </Link>

        <Link href="/admin/users" className={cardClass}>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Користувачі</span>
            <Users size={22} className="text-[#66852A]" />
          </div>
          <div className="text-3xl font-bold">—</div>
          <p className="mt-1 text-sm text-gray-500">статистика клієнтів</p>
        </Link>

        <Link href="/admin/categories" className={cardClass}>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Категорії</span>
            <FolderTree size={22} className="text-[#66852A]" />
          </div>
          <div className="text-3xl font-bold">
            {categoriesCount === null ? "…" : categoriesCount}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            категорій активних товарів
          </p>
        </Link>
      </div>
      {/* СТАТУСИ ЗАМОВЛЕНЬ */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Статуси замовлень</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {orderStatuses.map((status) => {
            const StatusIcon = status.icon;
            const count = orders.filter(
              (order) => order.status === status.value
            ).length;

            return (
              <Link
                key={status.value}
                href="/admin/orders"
                className={cardClass}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{status.label}</span>
                  <StatusIcon size={21} className={status.color} />
                </div>

                <div className="text-3xl font-bold">
                  {ordersLoading ? "…" : ordersError ? "—" : count}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Переглянути замовлення
                </p>
              </Link>
            );
          })}
        </div>
      </div>
      {/* ОСТАННІ ЗАМОВЛЕННЯ */}
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Останні замовлення</h2>

          <Link
            href="/admin/orders"
            className="text-sm font-medium text-[#66852A] transition hover:underline"
          >
            Переглянути всі →
          </Link>
        </div>

        {ordersLoading ? (
          <p className="py-6 text-center text-gray-500">
            Завантаження замовлень…
          </p>
        ) : ordersError ? (
          <p className="py-6 text-center text-red-600">{ordersError}</p>
        ) : orders.length === 0 ? (
          <p className="py-6 text-center text-gray-500">
            Замовлень поки немає.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href="/admin/orders"
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-b border-gray-100 px-2 py-4 transition hover:bg-[#F7F5EF]"
              >
                <div>
                  <p className="font-medium">
                    №{order.order_number} — {order.customer_name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {order.items?.length ?? 0} позицій ·{" "}
                    {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {money(Number(order.total) || 0)}
                  </p>
                  <span
                    className={`text-sm ${
                      statusColors[order.status] ?? "text-gray-500"
                    }`}
                  >
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
