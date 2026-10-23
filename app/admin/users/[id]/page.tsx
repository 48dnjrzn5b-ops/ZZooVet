import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Profile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
};

type Order = {
  id: string;
  order_number: number;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_method: string | null;
  delivery_address: string | null;
  payment_method: string | null;
  items: unknown;
  total: number | string;
  status: string;
  created_at: string;
};

const statusLabels: Record<string, string> = {
  new: "Нове",
  processing: "В обробці",
  shipped: "Відправлено",
  completed: "Виконано",
  cancelled: "Скасовано",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatMoney = (value: number | string) =>
  `${Number(value).toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} грн`;

function getOrderItems(items: unknown): string[] {
  if (!Array.isArray(items)) return [];

  return items.map((item: unknown) => {
    if (typeof item !== "object" || item === null) {
      return String(item);
    }

    const product = item as Record<string, unknown>;
    const name =
      product.name ?? product.product_name ?? product.title ?? "Товар";

    const quantity = product.quantity;

    return `${String(name)}${
      quantity !== undefined ? ` × ${String(quantity)}` : ""
    }`;
  });
}

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: currentProfile, error: currentProfileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentProfileError || currentProfile?.role !== "admin") {
    redirect("/");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, role, created_at")
    .eq("id", id)
    .maybeSingle();

  if (profileError) {
    return (
      <section className="flex-1 bg-[#F7F5EF] p-6 text-[#4A3528]">
        Не вдалося завантажити користувача: {profileError.message}
      </section>
    );
  }

  if (!profile) {
    notFound();
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      "id, order_number, user_id, customer_name, customer_phone, customer_email, delivery_method, delivery_address, payment_method, items, total, status, created_at"
    )
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const typedProfile = profile as Profile;
  const typedOrders = (orders ?? []) as Order[];

  const fullName =
    [typedProfile.first_name, typedProfile.last_name]
      .filter(Boolean)
      .join(" ") || "Ім’я не вказано";

  return (
    <section className="min-w-0 flex-1 bg-[#F7F5EF] p-4 text-[#4A3528] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-[#887969] transition hover:text-[#4A3528]"
        >
          <span aria-hidden="true">←</span>
          Назад до користувачів
        </Link>

        <div className="mb-8 mt-5">
          <p className="mb-2 text-sm text-[#887969]">
            Адміністративна панель / Користувачі / Деталі
          </p>

          <h1 className="text-2xl font-bold sm:text-3xl">{fullName}</h1>

          <p className="mt-2 text-sm text-[#887969]">
            Інформація про обліковий запис та замовлення
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#E8E0D5] bg-white p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-semibold">Особисті дані</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#887969]">Ім’я</p>
                <p className="mt-1 font-medium">
                  {typedProfile.first_name || "Не вказано"}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#887969]">Прізвище</p>
                <p className="mt-1 font-medium">
                  {typedProfile.last_name || "Не вказано"}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#887969]">Email</p>
                <p className="mt-1 break-all font-medium">
                  {typedProfile.email || "Не вказано"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8E0D5] bg-white p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-semibold">Обліковий запис</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#887969]">ID користувача</p>
                <p className="mt-1 break-all text-sm">{typedProfile.id}</p>
              </div>

              <div>
                <p className="text-sm text-[#887969]">Дата реєстрації</p>
                <p className="mt-1 font-medium">
                  {formatDate(typedProfile.created_at)}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#887969]">Роль</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    typedProfile.role === "admin"
                      ? "bg-[#F1E5D5] text-[#76502D]"
                      : "bg-[#E8F2E4] text-[#42643A]"
                  }`}
                >
                  {typedProfile.role === "admin" ? "Адміністратор" : "Покупець"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Замовлення</h2>

            <span className="rounded-full bg-white px-4 py-2 text-sm text-[#887969]">
              Усього: {typedOrders.length}
            </span>
          </div>

          {ordersError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Не вдалося завантажити замовлення. Перевір права доступу до
              таблиці orders: {ordersError.message}
            </div>
          ) : typedOrders.length === 0 ? (
            <div className="rounded-2xl border border-[#E8E0D5] bg-white p-8 text-center">
              <p className="font-medium">Замовлень поки немає</p>
              <p className="mt-2 text-sm text-[#887969]">
                Тут з’являться замовлення, пов’язані з цим обліковим записом.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {typedOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-2xl border border-[#E8E0D5] bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">
                        Замовлення № {order.order_number}
                      </h3>
                      <p className="mt-1 text-sm text-[#887969]">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#F7F5EF] px-3 py-1 text-sm">
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-[#887969]">Покупець</p>
                      <p className="mt-1">{order.customer_name}</p>
                      <p className="mt-1 text-sm">{order.customer_phone}</p>
                      {order.customer_email && (
                        <p className="mt-1 break-all text-sm">
                          {order.customer_email}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-[#887969]">Сума замовлення</p>
                      <p className="mt-1 text-lg font-bold">
                        {formatMoney(order.total)}
                      </p>

                      <p className="mt-3 text-sm text-[#887969]">
                        Оплата: {order.payment_method || "Не вказано"}
                      </p>
                      <p className="mt-1 text-sm text-[#887969]">
                        Доставка: {order.delivery_method || "Не вказано"}
                      </p>

                      {order.delivery_address && (
                        <p className="mt-1 text-sm text-[#887969]">
                          Адреса: {order.delivery_address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 border-t border-[#F0EBE3] pt-4">
                    <p className="mb-2 text-sm font-semibold">Товари</p>
                    {getOrderItems(order.items).length > 0 ? (
                      <ul className="space-y-1 text-sm text-[#6F6255]">
                        {getOrderItems(order.items).map((item, index) => (
                          <li key={`${order.id}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-[#887969]">
                        Немає інформації про товари.
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
