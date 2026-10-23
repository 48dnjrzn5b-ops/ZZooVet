import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

function createSlug(value: string) {
  const transliteration: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "h",
    ґ: "g",
    д: "d",
    е: "e",
    є: "ye",
    ж: "zh",
    з: "z",
    и: "y",
    і: "i",
    ї: "yi",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ю: "yu",
    я: "ya",
    ь: "",
    "'": "",
    ʼ: "",
    "’": "",
    "`": "",
  };

  return value
    .trim()
    .toLowerCase()
    .split("")
    .map((character) => transliteration[character] ?? character)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
      .from("categories")
      .select("id, title, slug, parent_id, sort_order, is_active")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Помилка завантаження категорій:", error);

      return NextResponse.json(
        { error: "Не вдалося завантажити категорії." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { categories: data ?? [] },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("Помилка API категорій:", error);

    return NextResponse.json(
      { error: "Внутрішня помилка сервера." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const { title, parent_id, sort_order } = body as Record<string, unknown>;

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Вкажи назву категорії." },
        { status: 400 }
      );
    }

    if (
      parent_id !== undefined &&
      parent_id !== null &&
      parent_id !== "" &&
      typeof parent_id !== "string"
    ) {
      return NextResponse.json(
        { error: "Некоректна основна категорія." },
        { status: 400 }
      );
    }

    if (
      sort_order !== undefined &&
      (!Number.isInteger(sort_order) || (sort_order as number) < 0)
    ) {
      return NextResponse.json(
        { error: "Порядок сортування має бути невід'ємним цілим числом." },
        { status: 400 }
      );
    }

    const parentId =
      typeof parent_id === "string" && parent_id.trim() ? parent_id : null;

    const cleanTitle = title.trim();
    const slug = createSlug(cleanTitle);

    if (!slug) {
      return NextResponse.json(
        { error: "Не вдалося створити URL-назву. Вкажи іншу назву." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    if (parentId) {
      const { data: parent, error: parentError } = await admin
        .from("categories")
        .select("id")
        .eq("id", parentId)
        .is("parent_id", null)
        .maybeSingle();

      if (parentError) {
        console.error("Помилка перевірки категорії:", parentError);

        return NextResponse.json(
          { error: "Не вдалося перевірити основну категорію." },
          { status: 500 }
        );
      }

      if (!parent) {
        return NextResponse.json(
          { error: "Обрана основна категорія не знайдена." },
          { status: 400 }
        );
      }
    }

    const { data: siblings, error: siblingsError } = parentId
      ? await admin
          .from("categories")
          .select("sort_order")
          .eq("parent_id", parentId)
      : await admin
          .from("categories")
          .select("sort_order")
          .is("parent_id", null);

    if (siblingsError) {
      console.error("Помилка визначення порядку:", siblingsError);

      return NextResponse.json(
        { error: "Не вдалося визначити порядок категорії." },
        { status: 500 }
      );
    }

    const nextOrder =
      siblings && siblings.length > 0
        ? Math.max(...siblings.map((item) => item.sort_order)) + 1
        : 1;

    const { data, error } = await admin
      .from("categories")
      .insert({
        title: cleanTitle,
        slug,
        parent_id: parentId,
        sort_order: typeof sort_order === "number" ? sort_order : nextOrder,
        is_active: true,
      })
      .select("id, title, slug, parent_id, sort_order, is_active")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "Категорія з такою URL-назвою вже існує в цьому розділі. Зміни назву.",
          },
          { status: 409 }
        );
      }

      console.error("Помилка створення категорії:", error);

      return NextResponse.json(
        { error: "Не вдалося створити категорію." },
        { status: 500 }
      );
    }

    return NextResponse.json({ category: data }, { status: 201 });
  } catch (error) {
    console.error("Помилка API категорій:", error);

    return NextResponse.json(
      { error: "Внутрішня помилка сервера." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const allowed = await isAdmin();

    if (!allowed) {
      return NextResponse.json(
        { error: "Доступ заборонено." },
        { status: 403 }
      );
    }

    const id = new URL(request.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Не вказано категорію для видалення." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id, title, slug, parent_id")
      .eq("id", id)
      .maybeSingle();

    if (categoryError) {
      return NextResponse.json(
        { error: "Не вдалося перевірити категорію." },
        { status: 500 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Категорію не знайдено." },
        { status: 404 }
      );
    }

    // Головну категорію не видаляємо, якщо в ній є підкатегорії.
    if (!category.parent_id) {
      const { count, error: childrenError } = await supabase
        .from("categories")
        .select("id", { count: "exact", head: true })
        .eq("parent_id", id);

      if (childrenError) {
        return NextResponse.json(
          { error: "Не вдалося перевірити підкатегорії." },
          { status: 500 }
        );
      }

      if ((count ?? 0) > 0) {
        return NextResponse.json(
          {
            error:
              "Спочатку видаліть або перенесіть підкатегорії цієї категорії.",
          },
          { status: 409 }
        );
      }
    }

    // Перевіряємо, чи є товари, пов'язані з категорією.
    const field = category.parent_id ? "subcategory" : "category";
    const values = [category.title, category.slug];

    for (const value of values) {
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id")
        .eq(field, value)
        .limit(1);

      if (productsError) {
        return NextResponse.json(
          { error: "Не вдалося перевірити пов'язані товари." },
          { status: 500 }
        );
      }

      if (products && products.length > 0) {
        return NextResponse.json(
          {
            error:
              "З цією категорією пов'язані товари. Спочатку змініть їхню категорію.",
          },
          { status: 409 }
        );
      }
    }

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Не вдалося видалити категорію." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Категорію успішно видалено.",
    });
  } catch {
    return NextResponse.json(
      { error: "Сталася внутрішня помилка сервера." },
      { status: 500 }
    );
  }
}
