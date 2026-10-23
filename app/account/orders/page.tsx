"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, ShoppingBag, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type OrderItem = {
  id: string;
  name: string;
  image?: string | null;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  order_number: number;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

const statusLabels: Record<string, string> = {
  new: "Нове",
  processing: "В обробці",
  shipped: "Відправлено",
  completed: "Виконано",
  cancelled: "Скасовано",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  processing: "bg-amber-100 text-amber-800",
  shipped: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (authError || !user) {
        router.replace("/account");
        return;
      }

      const response = await fetch("/api/orders", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!isMounted) return;

      if (!response.ok) {
        setError(result.error || "Не вдалося завантажити замовлення.");
        setIsLoading(false);
        return;
      }

      setOrders(result.orders ?? []);
      setIsLoading(false);
    }

    loadOrders().catch(() => {
      if (isMounted) {
        setError("Не вдалося завантажити замовлення. Спробуйте ще раз.");
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#4A3528] hover:text-[#66852A]"
        >
          <ArrowLeft size={18} />
          До особистого кабінету
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#66852A]/10 text-[#66852A]">
            <Package size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#4A3528] sm:text-3xl">
              Мої замовлення
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Історія покупок та статуси замовлень
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-gray-600">
            <LoaderCircle className="animate-spin" size={22} />
            Завантаження замовлень...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-[#66852A] px-5 py-2.5 font-medium text-white hover:bg-[#587522]"
            >
              Спробувати ще раз
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-[#E8E2D8] bg-white px-6 py-12 text-center">
            <ShoppingBag size={44} className="mx-auto mb-4 text-[#66852A]" />
            <h2 className="text-xl font-semibold text-[#4A3528]">
              У вас поки немає замовлень
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
              Ваші оформлені замовлення з’являтимуться тут.
            </p>
            <Link
              href="/catalog"
              className="mt-6 inline-flex rounded-xl bg-[#66852A] px-6 py-3 font-semibold text-white hover:bg-[#587522]"
            >
              Перейти до каталогу
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-2xl border border-[#E8E2D8] bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEE9E1] p-5">
                  <div>
                    <h2 className="font-bold text-[#4A3528]">
                      Замовлення №{order.order_number}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("uk-UA", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      statusColors[order.status] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </div>

                <div className="space-y-3 p-5">
                  {(order.items ?? []).map((item, index) => (
                    <div
                      key={`${order.id}-${item.id}-${index}`}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[#4A3528]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-gray-500">
                          {item.quantity} шт. ×{" "}
                          {Number(item.price).toLocaleString("uk-UA")} ₴
                        </p>
                      </div>

                      <p className="shrink-0 font-semibold text-[#4A3528]">
                        {(Number(item.price) * item.quantity).toLocaleString(
                          "uk-UA"
                        )}{" "}
                        ₴
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between bg-[#F9F8F4] px-5 py-4">
                  <span className="text-sm text-gray-600">Разом</span>
                  <span className="text-lg font-bold text-[#4A3528]">
                    {Number(order.total).toLocaleString("uk-UA")} ₴
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
