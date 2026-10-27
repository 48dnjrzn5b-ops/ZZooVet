"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, Package, RefreshCw } from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  brand?: string | null;
  sku?: string | null;
  category?: string | null;
  subcategory?: string | null;
  short_description?: string | null;
  description?: string | null;
  advantages?: string | null;
  characteristics?: string | null;
  composition?: string | null;
  feeding_recommendations?: string | null;
  attributes?: Record<string, unknown> | null;
};

type Order = {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_method: string | null;
  delivery_address: string | null;
  payment_method: string | null;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
};

const statuses = [
  { value: "new", label: "Нове" },
  { value: "processing", label: "В обробці" },
  { value: "shipped", label: "Відправлено" },
  { value: "completed", label: "Виконано" },
  { value: "cancelled", label: "Скасовано" },
];

const statusStyles: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  processing: "bg-amber-100 text-amber-800",
  shipped: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const money = (value: number) => `${Number(value).toLocaleString("uk-UA")} ₴`;

const attributeLabels: Record<string, string> = {
  animal_type: "Вид тварини",
  animaltype: "Вид тварини",
  "вид тварини": "Вид тварини",
  species: "Вид тварини",
  animal: "Вид тварини",
  weight: "Вага",
  volume: "Об’єм",
  size: "Розмір",
  age: "Вік тварини",
  animal_age: "Вік тварини",
  breed: "Порода",
  sex: "Стать",
  material: "Матеріал",
  color: "Колір",
  colour: "Колір",
  package_type: "Тип упаковки",
  food_type: "Тип корму",
  flavor: "Смак",
  taste: "Смак",
  "вага / об’єм": "Вага / об’єм",
  "вік тварини": "Вік тварини",
  "тип упаковки": "Тип упаковки",
};

function formatAttributeLabel(key: string): string {
  const normalized = key
    .trim()
    .toLocaleLowerCase("uk-UA")
    .replace(/[_-]+/g, " ");
  return (
    attributeLabels[normalized] ??
    attributeLabels[key.trim().toLocaleLowerCase("uk-UA")] ??
    normalized.charAt(0).toLocaleUpperCase("uk-UA") + normalized.slice(1)
  );
}

function formatAttributeValue(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(formatAttributeValue).filter(Boolean).join(", ");
  }
  return "";
}

function getItemAttributes(item: OrderItem): [string, string][] {
  if (!item.attributes || typeof item.attributes !== "object") return [];

  const skipped = new Set(["brand", "sku", "category", "subcategory"]);

  return Object.entries(item.attributes)
    .filter(([key]) => !skipped.has(key.trim().toLocaleLowerCase("uk-UA")))
    .map(
      ([key, value]) =>
        [formatAttributeLabel(key), formatAttributeValue(value)] as [
          string,
          string
        ]
    )
    .filter(([, value]) => value.length > 0);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders/admin", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Не вдалося завантажити замовлення.");
      }

      setOrders(result.orders ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Помилка завантаження замовлень."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrders() {
      setError("");

      try {
        const response = await fetch("/api/orders/admin", {
          cache: "no-store",
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Не вдалося завантажити замовлення.");
        }

        setOrders(result.orders ?? []);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error ? err.message : "Помилка завантаження замовлень."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchOrders();

    return () => controller.abort();
  }, []);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/orders/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Не вдалося оновити статус.");
      }

      setOrders((previous) =>
        previous.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );

      setNotice(`Статус замовлення №${result.order.order_number} оновлено.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Помилка оновлення статусу."
      );

      await loadOrders();
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#4A3528] hover:text-[#66852A]"
        >
          <ArrowLeft size={18} />
          До адмінпанелі
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#66852A]/10 p-3 text-[#66852A]">
              <Package size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#4A3528] sm:text-3xl">
                Замовлення
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Усього замовлень: {orders.length}
              </p>
            </div>
          </div>

          <button
            onClick={() => void loadOrders()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#D8D1C5] bg-white px-4 py-2.5 text-sm font-medium text-[#4A3528] hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Оновити
          </button>
        </div>

        {notice && (
          <p className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">
            {notice}
          </p>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700">
            {error}
            <button
              onClick={() => void loadOrders()}
              className="ml-3 font-semibold underline"
            >
              Спробувати ще раз
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-gray-600">
            <LoaderCircle className="animate-spin" />
            Завантаження замовлень...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-[#E8E2D8] bg-white p-10 text-center">
            <Package size={40} className="mx-auto mb-3 text-[#66852A]" />
            <h2 className="text-lg font-semibold text-[#4A3528]">
              Замовлень поки немає
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Нові замовлення з’являться тут після оформлення покупцем.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-2xl border border-[#E8E2D8] bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EEE9E1] p-5">
                  <div>
                    <h2 className="text-lg font-bold text-[#4A3528]">
                      Замовлення №{order.order_number}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString("uk-UA")}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        statusStyles[order.status] ??
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statuses.find((s) => s.value === order.status)?.label ??
                        order.status}
                    </span>

                    <select
                      aria-label={`Статус замовлення №${order.order_number}`}
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(event) =>
                        void updateStatus(order.id, event.target.value)
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#4A3528] disabled:opacity-50"
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-6 p-5 md:grid-cols-2">
                  <section>
                    <h3 className="mb-3 font-semibold text-[#4A3528]">
                      Дані покупця
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <strong className="text-gray-800">Ім’я:</strong>{" "}
                        {order.customer_name}
                      </p>

                      <p>
                        <strong className="text-gray-800">Телефон:</strong>{" "}
                        <a
                          href={`tel:${order.customer_phone}`}
                          className="hover:text-[#66852A]"
                        >
                          {order.customer_phone}
                        </a>
                      </p>

                      {order.customer_email && (
                        <p className="break-all">
                          <strong className="text-gray-800">Email:</strong>{" "}
                          {order.customer_email}
                        </p>
                      )}

                      {order.delivery_method && (
                        <p>
                          <strong className="text-gray-800">Доставка:</strong>{" "}
                          {order.delivery_method === "branch"
                            ? "У відділення Нової пошти"
                            : order.delivery_method === "address"
                            ? "Кур’єром за адресою"
                            : order.delivery_method}
                        </p>
                      )}

                      {order.delivery_address && (
                        <p>
                          <strong className="text-gray-800">Адреса:</strong>{" "}
                          {order.delivery_address}
                        </p>
                      )}

                      {order.payment_method && (
                        <p>
                          <strong className="text-gray-800">Оплата:</strong>{" "}
                          {order.payment_method === "cod"
                            ? "Оплата при отриманні"
                            : order.payment_method === "online"
                            ? "Онлайн-оплата"
                            : order.payment_method === "card"
                            ? "Оплата карткою"
                            : order.payment_method}
                        </p>
                      )}
                    </div>
                  </section>

                  <section>
                    <h3 className="mb-3 font-semibold text-[#4A3528]">
                      Товари
                    </h3>

                    <div className="space-y-4">
                      {(order.items ?? []).map((item, index) => {
                        const attributes = getItemAttributes(item);
                        const hasDetails = Boolean(
                          item.brand ||
                            item.sku ||
                            item.category ||
                            item.subcategory ||
                            item.short_description ||
                            item.description ||
                            item.advantages ||
                            item.characteristics ||
                            item.composition ||
                            item.feeding_recommendations ||
                            attributes.length > 0
                        );

                        return (
                          <div
                            key={`${order.id}-${item.id}-${index}`}
                            className="rounded-xl border border-[#EEE9E1] p-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-semibold text-[#4A3528]">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Кількість: {item.quantity} шт. · Ціна за
                                  одиницю: {money(Number(item.price))}
                                </p>
                              </div>
                              <span className="shrink-0 text-sm font-bold text-[#4A3528]">
                                {money(Number(item.price) * item.quantity)}
                              </span>
                            </div>

                            {hasDetails ? (
                              <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                                {(item.brand ||
                                  item.sku ||
                                  item.category ||
                                  item.subcategory) && (
                                  <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                                    {item.brand && (
                                      <p>
                                        <strong className="text-gray-800">
                                          Бренд:
                                        </strong>{" "}
                                        {item.brand}
                                      </p>
                                    )}
                                    {item.sku && (
                                      <p>
                                        <strong className="text-gray-800">
                                          Артикул:
                                        </strong>{" "}
                                        {item.sku}
                                      </p>
                                    )}
                                    {item.category && (
                                      <p>
                                        <strong className="text-gray-800">
                                          Категорія:
                                        </strong>{" "}
                                        {item.category}
                                      </p>
                                    )}
                                    {item.subcategory && (
                                      <p>
                                        <strong className="text-gray-800">
                                          Підкатегорія:
                                        </strong>{" "}
                                        {item.subcategory}
                                      </p>
                                    )}
                                  </div>
                                )}

                                {attributes.length > 0 && (
                                  <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                                    {attributes.map(([label, value]) => (
                                      <p key={`${item.id}-${label}`}>
                                        <strong className="text-gray-800">
                                          {label}:
                                        </strong>{" "}
                                        {value}
                                      </p>
                                    ))}
                                  </div>
                                )}

                                {item.short_description && (
                                  <p>
                                    <strong className="text-gray-800">
                                      Короткий опис:
                                    </strong>{" "}
                                    {item.short_description}
                                  </p>
                                )}
                                {item.description && (
                                  <p className="whitespace-pre-wrap">
                                    <strong className="text-gray-800">
                                      Опис:
                                    </strong>{" "}
                                    {item.description}
                                  </p>
                                )}
                                {item.advantages && (
                                  <p className="whitespace-pre-wrap">
                                    <strong className="text-gray-800">
                                      Переваги:
                                    </strong>{" "}
                                    {item.advantages}
                                  </p>
                                )}
                                {item.characteristics && (
                                  <p className="whitespace-pre-wrap">
                                    <strong className="text-gray-800">
                                      Характеристики:
                                    </strong>{" "}
                                    {item.characteristics}
                                  </p>
                                )}
                                {item.composition && (
                                  <p className="whitespace-pre-wrap">
                                    <strong className="text-gray-800">
                                      Склад:
                                    </strong>{" "}
                                    {item.composition}
                                  </p>
                                )}
                                {item.feeding_recommendations && (
                                  <p className="whitespace-pre-wrap">
                                    <strong className="text-gray-800">
                                      Рекомендації щодо годування:
                                    </strong>{" "}
                                    {item.feeding_recommendations}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="mt-2 text-xs text-gray-400">
                                Характеристики не збережені в цьому замовленні.
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
                      <span className="font-semibold text-[#4A3528]">
                        Разом
                      </span>
                      <span className="text-lg font-bold text-[#66852A]">
                        {money(Number(order.total))}
                      </span>
                    </div>
                  </section>
                </div>

                {updatingId === order.id && (
                  <div className="flex items-center gap-2 bg-gray-50 px-5 py-3 text-sm text-gray-500">
                    <LoaderCircle size={16} className="animate-spin" />
                    Збереження статусу...
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
