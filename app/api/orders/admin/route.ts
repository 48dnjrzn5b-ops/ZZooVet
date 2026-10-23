import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const allowedStatuses = [
  "new",
  "processing",
  "shipped",
  "completed",
  "cancelled",
] as const;

async function isAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return false;

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  return Boolean(adminEmail && user.email?.toLowerCase() === adminEmail);
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Недостатньо прав доступу." },
        { status: 403 }
      );
    }

    const admin = createAdminClient();

    const { data, error } = await admin
      .from("orders")
      .select(
        "id, order_number, customer_name, customer_phone, customer_email, delivery_method, delivery_address, payment_method, items, total, status, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Помилка завантаження замовлень:", error);

      return NextResponse.json(
        { error: "Не вдалося завантажити замовлення." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { orders: data ?? [] },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("Помилка API адмінки:", error);

    return NextResponse.json(
      { error: "Внутрішня помилка сервера." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Недостатньо прав доступу." },
        { status: 403 }
      );
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Некоректні дані." }, { status: 400 });
    }

    const { id, status } = body as Record<string, unknown>;

    if (
      typeof id !== "string" ||
      !id.trim() ||
      typeof status !== "string" ||
      !allowedStatuses.includes(status as (typeof allowedStatuses)[number])
    ) {
      return NextResponse.json(
        { error: "Некоректний номер замовлення або статус." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data, error } = await admin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select("id, order_number, status")
      .maybeSingle();

    if (error) {
      console.error("Помилка оновлення статусу:", error);

      return NextResponse.json(
        { error: "Не вдалося оновити статус замовлення." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Замовлення не знайдено." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    console.error("Помилка оновлення замовлення:", error);

    return NextResponse.json(
      { error: "Внутрішня помилка сервера." },
      { status: 500 }
    );
  }
}
