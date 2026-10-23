"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useShop } from "@/components/ShopContext";

type CheckoutDialogProps = {
  open: boolean;
  onClose: () => void;
};

type DeliveryType = "branch" | "postomat" | "pickup";
type PaymentType = "cod" | "monobank" | "cash";

type OrderResponse = {
  error?: string;
  order?: {
    order_number: number | string;
    total: number;
    status: string;
  };
};

export default function CheckoutDialog({ open, onClose }: CheckoutDialogProps) {
  const { cart, removePurchasedFromCart } = useShop();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [delivery, setDelivery] = useState<DeliveryType>("branch");
  const [payment, setPayment] = useState<PaymentType>("cod");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState<number | string | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadUser() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Помилка завантаження профілю:", error.message);
        }

        if (cancelled) return;

        const user = data.user;

        if (user) {
          setName(user.user_metadata?.full_name ?? "");
          setEmail(user.email ?? "");
          setPhone(user.user_metadata?.phone ?? "");
        }
      } catch (error) {
        console.error("Помилка завантаження профілю:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadUser();

    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (cart.length === 0) {
      setErrorMessage("Ваш кошик порожній.");
      return;
    }

    // Не створюємо замовлення з онлайн-оплатою,
    // доки серверний платіжний маршрут Monobank не підключено.
    if (payment === "monobank") {
      setErrorMessage(
        "Онлайн-оплата Monobank ще підключається. Будь ласка, виберіть доступний спосіб оплати."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          customer_email: email.trim(),
          delivery_method: delivery,
          delivery_address:
            delivery === "pickup"
              ? "Самовивіз із магазину"
              : `${city.trim()}, ${location.trim()}`,
          payment_method: payment,
          items: cart.map((product) => ({
            id: String(product.id),
            quantity: Math.max(1, product.quantity ?? 1),
          })),
        }),
      });

      const responseText = await response.text();

      let result: OrderResponse;

      try {
        result = JSON.parse(responseText) as OrderResponse;
      } catch {
        console.error(
          "API повернув не JSON:",
          response.status,
          responseText.slice(0, 500)
        );

        setErrorMessage(
          `Помилка сервера (${response.status}). Перевір термінал VS Code.`
        );
        return;
      }

      if (!response.ok || !result.order) {
        setErrorMessage(
          result.error ?? "Не вдалося оформити замовлення. Спробуйте ще раз."
        );
        return;
      }

      // Очищаємо кошик лише після успішного створення замовлення.
      removePurchasedFromCart(cart.map((product) => product.id));
      setOrderNumber(result.order.order_number);
    } catch (error) {
      console.error("Помилка оформлення замовлення:", error);
      setErrorMessage(
        "Не вдалося зв’язатися із сервером. Перевірте інтернет і спробуйте ще раз."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#4A3528]">
            {orderNumber !== null
              ? "Замовлення оформлено"
              : "Оформлення замовлення"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
            aria-label="Закрити"
          >
            ✕
          </button>
        </div>

        {orderNumber !== null ? (
          <div className="space-y-4 py-6 text-center">
            <div className="text-4xl text-[#66852A]">✓</div>

            <h3 className="text-xl font-semibold">Дякуємо за замовлення!</h3>

            <p className="text-gray-600">Номер вашого замовлення:</p>

            <p className="text-2xl font-bold text-[#66852A]">№ {orderNumber}</p>

            <p className="text-sm text-gray-500">
              Замовлення збережено. Наш менеджер зможе опрацювати його.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-[#66852A] px-4 py-3 font-semibold text-white transition hover:bg-[#587522]"
            >
              Готово
            </button>
          </div>
        ) : loading ? (
          <p className="py-8 text-center text-gray-500">Завантажуємо дані…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <section className="space-y-3">
              <h3 className="font-semibold">Контактні дані</h3>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ім’я та прізвище"
                autoComplete="name"
                required
                className="w-full rounded-xl border p-3 outline-none focus:border-[#66852A]"
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Номер телефону"
                autoComplete="tel"
                required
                className="w-full rounded-xl border p-3 outline-none focus:border-[#66852A]"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                required
                className="w-full rounded-xl border p-3 outline-none focus:border-[#66852A]"
              />
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold">Спосіб отримання</h3>

              <select
                value={delivery}
                onChange={(e) => {
                  const nextDelivery = e.target.value as DeliveryType;

                  setDelivery(nextDelivery);
                  setPayment(nextDelivery === "pickup" ? "cash" : "cod");
                  setErrorMessage("");
                }}
                className="w-full rounded-xl border bg-white p-3"
              >
                <option value="branch">Відділення Нової пошти</option>
                <option value="postomat">Поштомат Нової пошти</option>
                <option value="pickup">Самовивіз із магазину</option>
              </select>

              {delivery !== "pickup" && (
                <>
                  <input
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setLocation("");
                    }}
                    placeholder="Місто"
                    required
                    className="w-full rounded-xl border p-3 outline-none focus:border-[#66852A]"
                  />

                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={
                      delivery === "branch"
                        ? "Номер або адреса відділення"
                        : "Номер або адреса поштомата"
                    }
                    required
                    className="w-full rounded-xl border p-3 outline-none focus:border-[#66852A]"
                  />

                  <p className="text-xs text-gray-500">
                    Місто й пункт доставки поки вводяться вручну.
                  </p>
                </>
              )}
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold">Спосіб оплати</h3>

              {delivery === "pickup" ? (
                <>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-3">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={payment === "cash"}
                      onChange={() => setPayment("cash")}
                    />
                    Готівкою в магазині
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-3">
                    <input
                      type="radio"
                      name="payment"
                      value="monobank"
                      checked={payment === "monobank"}
                      onChange={() => setPayment("monobank")}
                    />
                    Онлайн через Monobank
                  </label>
                </>
              ) : (
                <>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-3">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={payment === "cod"}
                      onChange={() => setPayment("cod")}
                    />
                    Оплата при отриманні
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-3">
                    <input
                      type="radio"
                      name="payment"
                      value="monobank"
                      checked={payment === "monobank"}
                      onChange={() => setPayment("monobank")}
                    />
                    Онлайн через Monobank
                  </label>
                </>
              )}
            </section>

            {errorMessage && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {errorMessage}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-xl border px-4 py-3 font-medium disabled:opacity-50"
              >
                Назад
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-[#66852A] px-4 py-3 font-semibold text-white transition hover:bg-[#587522] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Оформлюємо..." : "Підтвердити замовлення"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
