"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Truck,
  CreditCard,
  Save,
  LoaderCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type DeliveryForm = {
  recipient_first_name: string;
  recipient_last_name: string;
  phone: string;
  city: string;
  delivery_service: string;
  delivery_type: string;
  branch_number: string;
  delivery_address: string;
  payment_method: string;
  card_last_four: string;
};

const initialForm: DeliveryForm = {
  recipient_first_name: "",
  recipient_last_name: "",
  phone: "",
  city: "",
  delivery_service: "nova_poshta",
  delivery_type: "branch",
  branch_number: "",
  delivery_address: "",
  payment_method: "cash_on_delivery",
  card_last_four: "",
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#E5DED2] bg-white px-4 py-3 text-sm text-[#4A3528] outline-none transition focus:border-[#66852A] focus:ring-2 focus:ring-[#66852A]/10";

const labelClass = "block text-sm font-medium text-[#4A3528]";

export default function DeliveryPage() {
  const router = useRouter();

  const [form, setForm] = useState<DeliveryForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadDelivery() {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (authError || !user) {
        router.replace("/account");
        return;
      }

      const { data, error } = await supabase
        .from("delivery_profiles")
        .select(
          "recipient_first_name, recipient_last_name, phone, city, delivery_service, delivery_type, branch_number, delivery_address, payment_method, card_last_four"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("Помилка завантаження доставки:", error);
        setMessage("Не вдалося завантажити дані. Спробуйте оновити сторінку.");
        setMessageError(true);
      } else if (data) {
        setForm({
          ...initialForm,
          ...data,
        });
      }

      setLoading(false);
    }

    void loadDelivery();

    return () => {
      active = false;
    };
  }, [router]);

  function updateField(field: keyof DeliveryForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setMessage("");
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setMessage("Увійдіть у свій акаунт, щоб зберегти дані.");
      setMessageError(true);
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("delivery_profiles").upsert(
      {
        id: user.id,
        ...form,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Помилка збереження доставки:", error);
      setMessage("Не вдалося зберегти дані. Спробуйте ще раз.");
      setMessageError(true);
    } else {
      setMessage("Дані успішно збережено!");
      setMessageError(false);
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-[#F7F5EF]">
        <LoaderCircle className="animate-spin text-[#66852A]" size={28} />
        <span className="ml-3 text-sm text-gray-500">Завантажуємо дані...</span>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#F7F5EF] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#66852A]"
        >
          <ArrowLeft size={17} />
          До особистого кабінету
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#66852A]">
            ЗООVet Світ
          </p>
          <h1 className="text-3xl font-bold text-[#4A3528] sm:text-4xl">
            Доставка й оплата
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Збережіть дані одержувача, щоб було зручніше оформлювати замовлення.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <section className="rounded-2xl border border-[#E9E3D8] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#EAF0DF] p-3 text-[#66852A]">
                <Truck size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#4A3528]">
                  Одержувач
                </h2>
                <p className="text-sm text-gray-500">
                  Хто отримуватиме замовлення
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Ім’я
                <input
                  className={inputClass}
                  value={form.recipient_first_name}
                  onChange={(e) =>
                    updateField("recipient_first_name", e.target.value)
                  }
                  autoComplete="given-name"
                  required
                />
              </label>

              <label className={labelClass}>
                Прізвище
                <input
                  className={inputClass}
                  value={form.recipient_last_name}
                  onChange={(e) =>
                    updateField("recipient_last_name", e.target.value)
                  }
                  autoComplete="family-name"
                  required
                />
              </label>

              <label className={`${labelClass} sm:col-span-2`}>
                Номер телефону
                <input
                  className={inputClass}
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+380..."
                  autoComplete="tel"
                  required
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E9E3D8] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#EAF0DF] p-3 text-[#66852A]">
                <MapPin size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#4A3528]">
                  Адреса доставки
                </h2>
                <p className="text-sm text-gray-500">
                  Куди доставляти замовлення
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className={labelClass}>
                Місто або населений пункт
                <input
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  autoComplete="address-level2"
                  required
                />
              </label>

              <label className={labelClass}>
                Служба доставки
                <select
                  className={inputClass}
                  value={form.delivery_service}
                  onChange={(e) => {
                    const service = e.target.value;
                    setForm((current) => ({
                      ...current,
                      delivery_service: service,
                      delivery_type:
                        service === "nova_poshta" ? "branch" : "address",
                    }));
                    setMessage("");
                  }}
                >
                  <option value="nova_poshta">Нова пошта</option>
                  <option value="ukrposhta">Укрпошта</option>
                  <option value="courier">Кур’єрська доставка</option>
                </select>
              </label>

              {form.delivery_service !== "courier" && (
                <label className={labelClass}>
                  Тип доставки
                  <select
                    className={inputClass}
                    value={form.delivery_type}
                    onChange={(e) =>
                      updateField("delivery_type", e.target.value)
                    }
                  >
                    <option value="branch">Відділення</option>
                    <option value="parcel_locker">Поштомат</option>
                    <option value="address">За адресою</option>
                  </select>
                </label>
              )}

              {form.delivery_type === "branch" ||
              form.delivery_type === "parcel_locker" ? (
                <label className={labelClass}>
                  {form.delivery_type === "branch"
                    ? "Номер відділення"
                    : "Номер поштомата"}
                  <input
                    className={inputClass}
                    value={form.branch_number}
                    onChange={(e) =>
                      updateField("branch_number", e.target.value)
                    }
                    placeholder="Наприклад, 12"
                    required
                  />
                </label>
              ) : (
                <label className={labelClass}>
                  {form.delivery_service === "courier"
                    ? "Адреса для кур’єра"
                    : "Вулиця, будинок, квартира"}
                  <input
                    className={inputClass}
                    value={form.delivery_address}
                    onChange={(e) =>
                      updateField("delivery_address", e.target.value)
                    }
                    autoComplete="street-address"
                    required
                  />
                </label>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E9E3D8] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#EAF0DF] p-3 text-[#66852A]">
                <CreditCard size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#4A3528]">
                  Спосіб оплати
                </h2>
                <p className="text-sm text-gray-500">
                  Оберіть зручний спосіб оплати
                </p>
              </div>
            </div>

            <label className={labelClass}>
              Спосіб оплати
              <select
                className={inputClass}
                value={form.payment_method}
                onChange={(e) => updateField("payment_method", e.target.value)}
              >
                <option value="cash_on_delivery">Оплата при отриманні</option>
                <option value="online_card">Оплата карткою онлайн</option>
              </select>
            </label>

            {form.payment_method === "online_card" && (
              <p className="mt-3 rounded-xl bg-[#F7F5EF] p-4 text-sm leading-6 text-gray-600">
                Оплата карткою має відбуватися через захищену платіжну сторінку
                під час оформлення замовлення. Не вводьте тут номер картки або
                CVV.
              </p>
            )}
          </section>

          {message && (
            <p
              role="status"
              className={`rounded-xl p-4 text-sm ${
                messageError
                  ? "bg-red-50 text-red-700"
                  : "bg-[#EAF0DF] text-[#496522]"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#66852A] px-6 py-3.5 font-semibold text-white transition hover:bg-[#587522] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Зберігаємо..." : "Зберегти дані"}
          </button>
        </form>
      </div>
    </main>
  );
}
