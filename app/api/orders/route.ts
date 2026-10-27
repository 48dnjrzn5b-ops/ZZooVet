import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type OrderItemInput = {
  id: string;
  quantity: number;
};

const optionalText = (value: unknown): string | null =>
  typeof value === "string" ? value.trim() || null : null;

function escapeHtml(value: unknown): string {
  const replacements: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) => replacements[character] ?? character
  );
}

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

    if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
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

      quantities.set(item.id, (quantities.get(item.id) ?? 0) + item.quantity);
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
      .select(
        "id, name, price, image1, stock_quantity, is_active, brand, sku, category, subcategory, short_description, description, advantages, characteristics, composition, feeding_recommendations, attributes"
      )
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
      brand: string | null;
      sku: string | null;
      category: string | null;
      subcategory: string | null;
      short_description: string | null;
      description: string | null;
      advantages: string | null;
      characteristics: string | null;
      composition: string | null;
      feeding_recommendations: string | null;
      attributes: Record<string, unknown>;
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
          { error: `Недостатньо товару «${product.name}» на складі.` },
          { status: 400 }
        );
      }

      total += price * quantity;

      const productAttributes =
        product.attributes &&
        typeof product.attributes === "object" &&
        !Array.isArray(product.attributes)
          ? (product.attributes as unknown as Record<string, unknown>)
          : {};

      orderItems.push({
        id: product.id,
        name: product.name,
        image: product.image1 ?? null,
        price,
        quantity,
        brand: product.brand ?? null,
        sku: product.sku ?? null,
        category: product.category ?? null,
        subcategory: product.subcategory ?? null,
        short_description: product.short_description ?? null,
        description: product.description ?? null,
        advantages: product.advantages ?? null,
        characteristics: product.characteristics ?? null,
        composition: product.composition ?? null,
        feeding_recommendations: product.feeding_recommendations ?? null,
        attributes: productAttributes,
      });
    }

    total = Math.round((total + Number.EPSILON) * 100) / 100;

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

    // Профіль оновлюється лише після успішного створення замовлення.
    if (user) {
      const nameParts = customer_name.trim().split(/\s+/);
      const firstName = nameParts.shift() ?? "";
      const lastName = nameParts.join(" ") || null;

      const { error: profileError } = await admin.from("profiles").upsert(
        {
          id: user.id,
          email: optionalText(customer_email) ?? user.email ?? null,
          first_name: firstName,
          last_name: lastName,
          phone: customer_phone.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (profileError) {
        console.error("Не вдалося оновити профіль:", profileError);
      }
    }

    // Email-сповіщення: помилка відправлення не скасовує створене замовлення.
    const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!notificationEmail || !resendApiKey) {
      console.error(
        "Email-сповіщення не налаштоване. Перевір RESEND_API_KEY та ORDER_NOTIFICATION_EMAIL у змінних середовища."
      );
    } else {
      try {
        const resend = new Resend(resendApiKey);

        const deliveryLabels: Record<string, string> = {
          branch: "Відділення Нової пошти",
          postomat: "Поштомат Нової пошти",
          pickup: "Самовивіз із магазину",
        };

        const paymentLabels: Record<string, string> = {
          cod: "Оплата при отриманні",
          cash: "Готівкою в магазині",
          monobank: "Monobank",
        };

        const itemRows = orderItems
          .map(
            (item) => `
              <tr>
                <td style="padding:10px;border-bottom:1px solid #eee;">
                  ${escapeHtml(item.name)}
                </td>
                <td style="padding:10px;text-align:center;border-bottom:1px solid #eee;">
                  ${item.quantity}
                </td>
                <td style="padding:10px;text-align:right;border-bottom:1px solid #eee;">
                  ${item.price.toLocaleString("uk-UA")} грн
                </td>
                <td style="padding:10px;text-align:right;border-bottom:1px solid #eee;">
                  ${(item.price * item.quantity).toLocaleString("uk-UA")} грн
                </td>
              </tr>
            `
          )
          .join("");

        const formattedTotal = Number(order.total).toLocaleString("uk-UA", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        const { error: emailError } = await resend.emails.send({
          from: "ЗООVet Світ <onboarding@resend.dev>",
          to: [notificationEmail],
          subject: `Нове замовлення №${order.order_number} — ЗООVet Світ`,
          html: `
            <div style="font-family:Arial,sans-serif;color:#333;max-width:700px;margin:0 auto;">
              <h1 style="color:#66852A;">🐾 ЗООVet Світ</h1>
              <h2>Нове замовлення №${escapeHtml(order.order_number)}</h2>
              <p>На сайті оформлено нове замовлення.</p>

              <h3>Контактні дані покупця</h3>
              <p>
                <strong>Ім’я:</strong> ${escapeHtml(customer_name)}<br>
                <strong>Телефон:</strong> ${escapeHtml(customer_phone)}<br>
                <strong>Email:</strong> ${escapeHtml(
                  optionalText(customer_email) ?? user?.email ?? "Не вказано"
                )}
              </p>

              <h3>Доставка й оплата</h3>
              <p>
                <strong>Спосіб отримання:</strong>
                ${escapeHtml(
                  deliveryLabels[String(delivery_method)] ??
                    delivery_method ??
                    "Не вказано"
                )}<br>
                <strong>Адреса:</strong>
                ${escapeHtml(delivery_address ?? "Не вказано")}<br>
                <strong>Оплата:</strong>
                ${escapeHtml(
                  paymentLabels[String(payment_method)] ??
                    payment_method ??
                    "Не вказано"
                )}
              </p>

              <h3>Товари в замовленні</h3>
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="background:#f5f5f5;">
                    <th style="padding:10px;text-align:left;">Товар</th>
                    <th style="padding:10px;">Кількість</th>
                    <th style="padding:10px;text-align:right;">Ціна</th>
                    <th style="padding:10px;text-align:right;">Сума</th>
                  </tr>
                </thead>
                <tbody>${itemRows}</tbody>
              </table>

              <h2 style="text-align:right;color:#66852A;">
                Разом: ${formattedTotal} грн
              </h2>
              <p style="color:#777;font-size:13px;">
                Замовлення збережено в адмін-панелі сайту.
              </p>
            </div>
          `,
        });

        if (emailError) {
          console.error(
            "Resend не зміг надіслати сповіщення про замовлення:",
            emailError
          );
        } else {
          console.info("Email-сповіщення про нове замовлення надіслано.", {
            orderNumber: order.order_number,
          });
        }
      } catch (emailError) {
        console.error("Помилка надсилання email-сповіщення:", emailError);
      }
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
