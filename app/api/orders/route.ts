
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type OrderItemInput = {
  id: string;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Некоректні дані замовлення." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const {
      customer_name,
      customer_phone,
      customer_email,
      delivery_method,
      delivery_address,
      payment_method,
      items,
    } = data;

    if (
      typeof customer_name !== "string" ||
      !customer_name.trim() ||
      typeof customer_phone !== "string" ||
      !customer_phone.trim()
    ) {
      return NextResponse.json(
        { error: "Вкажіть ім'я та телефон покупця." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 100
    ) {
      return NextResponse.json(
        { error: "Кошик порожній або містить забагато товарів." },
        { status: 400 }
      );
    }

    const quantities = new Map<string, number>();

    for (const item of items as OrderItemInput[]) {
      if (
        !item ||
        typeof item.id !== "string" ||
        !item.id.trim() ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 100
      ) {
        return NextResponse.json(
          { error: "Некоректні дані товарів у кошику." },
          { status: 400 }
        );
      }

      quantities.set(
        item.id,
        (quantities.get(item.id) ?? 0) + item.quantity
      );
    }

    for (const quantity of quantities.values()) {
      if (quantity > 100) {
        return NextResponse.json(
          { error: "Перевищено максимальну кількість товару." },
          { status: 400 }
        );
      }
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Помилка перевірки користувача:", userError);
    }

    const admin = createAdminClient();
    const productIds = Array.from(quantities.keys());

    const { data: products, error: productsError } = await admin
      .from("products")
      .select("id, name, price, image1, stock_quantity, is_active")
      .in("id", productIds)
      .eq("is_active", true);

    if (productsError) {
      console.error("Помилка перевірки товарів:", productsError);

      return NextResponse.json(
        { error: "Не вдалося перевірити товари." },
        { status: 500 }
      );
    }

    if (!products || products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Один або кілька товарів більше недоступні." },
        { status: 400 }
      );
    }

    const orderItems: {
      id: string;
      name: string;
      image: string | null;
      price: number;
      quantity: number;
    }[] = [];

    let total = 0;

    for (const product of products) {
      const quantity = quantities.get(product.id);

      if (quantity === undefined) {
        return NextResponse.json(
          { error: "Некоректний склад замовлення." },
          { status: 400 }
        );
      }

      const price = Number(product.price);
      const stock = Number(product.stock_quantity ?? 0);

      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json(
          { error: "Некоректна ціна товару." },
          { status: 400 }
        );
      }

      if (!Number.isSafeInteger(stock) || stock < quantity) {
        return NextResponse.json(
          {
            error: `Недостатньо товару «${product.name}» на складі.`,
          },
          { status: 400 }
        );
      }

      total += price * quantity;

      orderItems.push({
        id: product.id,
        name: product.name,
        image: product.image1 ?? null,
        price,
        quantity,
      });
    }

    total = Math.round((total + Number.EPSILON) * 100) / 100;

    const optionalText = (value: unknown): string | null =>
      typeof value === "string" ? value.trim() || null : null;

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        customer_name: customer_name.trim(),
        customer_phone: customer_phone.trim(),
        customer_email: optionalText(customer_email) ?? user?.email ?? null,
        delivery_method: optionalText(delivery_method),
        delivery_address: optionalText(delivery_address),
        payment_method: optionalText(payment_method),
        items: orderItems,
        total,
        status: "new",
      })
      .select("id, order_number, total, status, created_at")
      .single();

    if (orderError) {
      console.error("Помилка створення замовлення:", orderError);

      return NextResponse.json(
        { error: "Не вдалося створити замовлення." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Замовлення успішно створено.",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Помилка API замовлень:", error);

    return NextResponse.json(
      { error: "Помилка під час оформлення замовлення." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Увійдіть в акаунт, щоб переглянути замовлення." },
        { status: 401 }
      );
    }

    const admin = createAdminClient();

    const { data: orders, error } = await admin
      .from("orders")
      .select("id, order_number, total, status, created_at, items")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Помилка отримання замовлень:", error);

      return NextResponse.json(
        { error: "Не вдалося завантажити замовлення." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { orders: orders ?? [] },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error("Помилка API замовлень:", error);

    return NextResponse.json(
      { error: "Внутрішня помилка сервера." },
      { status: 500 }
    );
  }
}