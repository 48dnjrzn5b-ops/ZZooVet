"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ProductForm = {
  name: string;
  brand: string;
  sku: string;
  category: string;
  subcategory: string;
  price: string;
  oldPrice: string;
  currency: string;
  availability: string;
  stockQuantity: string;
  image1: string;
  image2: string;
  image3: string;
  shortDescription: string;
  description: string;
  advantages: string;
  characteristics: string;
  composition: string;
  feedingRecommendations: string;
  isActive: boolean;
  isPopular: boolean;
  isNew: boolean;
  isSale: boolean;
  sortOrder: string;
};

const initialForm: ProductForm = {
  name: "",
  brand: "",
  sku: "",
  category: "",
  subcategory: "",
  price: "",
  oldPrice: "",
  currency: "UAH",
  availability: "В наявності",
  stockQuantity: "0",
  image1: "",
  image2: "",
  image3: "",
  shortDescription: "",
  description: "",
  advantages: "",
  characteristics: "",
  composition: "",
  feedingRecommendations: "",
  isActive: true,
  isPopular: false,
  isNew: false,
  isSale: false,
  sortOrder: "0",
};

type Category = {
  id: string;
  title: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
};

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]";

const labelClass = "mb-2 block text-sm font-medium text-gray-700";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;

  const [form, setForm] = useState<ProductForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("categories")
        .select("id, title, slug, parent_id, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("Помилка завантаження категорій:", error.message);
        setErrorMessage(
          "Не вдалося завантажити категорії. Перевірте підключення до Supabase."
        );
      } else {
        setCategories(data ?? []);
      }

      setCategoriesLoading(false);
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (cancelled) return;

      if (error || !data) {
        setErrorMessage(error?.message ?? "Товар не знайдено.");
        setLoading(false);
        return;
      }

      setForm({
        name: data.name ?? "",
        brand: data.brand ?? "",
        sku: data.sku ?? "",
        category: data.category ?? "",
        subcategory: data.subcategory ?? "",
        price: String(data.price ?? ""),
        oldPrice: data.old_price == null ? "" : String(data.old_price),
        currency: data.currency ?? "UAH",
        availability: data.availability ?? "В наявності",
        stockQuantity: String(data.stock_quantity ?? 0),
        image1: data.image1 ?? "",
        image2: data.image2 ?? "",
        image3: data.image3 ?? "",
        shortDescription: data.short_description ?? "",
        description: data.description ?? "",
        advantages: data.advantages ?? "",
        characteristics: data.characteristics ?? "",
        composition: data.composition ?? "",
        feedingRecommendations: data.feeding_recommendations ?? "",
        isActive: data.is_active ?? true,
        isPopular: data.is_popular ?? false,
        isNew: data.is_new ?? false,
        isSale: data.is_sale ?? false,
        sortOrder: String(data.sort_order ?? 0),
      });

      setLoading(false);
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  function updateField<K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function handleCategoryChange(value: string) {
    setForm((previous) => ({
      ...previous,
      category: value,
      subcategory: "",
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Вкажіть назву товару.");
      return;
    }

    if (!form.category) {
      alert("Оберіть категорію товару.");
      return;
    }

    if (
      form.price.trim() === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      alert("Вкажіть коректну ціну товару.");
      return;
    }

    if (
      form.oldPrice.trim() !== "" &&
      (!Number.isFinite(Number(form.oldPrice)) || Number(form.oldPrice) < 0)
    ) {
      alert("Вкажіть коректну стару ціну.");
      return;
    }

    if (
      !Number.isFinite(Number(form.stockQuantity)) ||
      Number(form.stockQuantity) < 0
    ) {
      alert("Вкажіть коректну кількість на складі.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("products")
        .update({
          name: form.name.trim(),
          brand: form.brand.trim() || null,
          sku: form.sku.trim() || null,
          category: form.category,
          subcategory: form.subcategory || null,
          price: Number(form.price),
          old_price: form.oldPrice.trim() ? Number(form.oldPrice) : null,
          currency: form.currency,
          availability: form.availability,
          stock_quantity: Number(form.stockQuantity || 0),
          image1: form.image1.trim() || null,
          image2: form.image2.trim() || null,
          image3: form.image3.trim() || null,
          short_description: form.shortDescription || null,
          description: form.description || null,
          advantages: form.advantages || null,
          characteristics: form.characteristics || null,
          composition: form.composition || null,
          feeding_recommendations: form.feedingRecommendations || null,
          is_active: form.isActive,
          is_popular: form.isPopular,
          is_new: form.isNew,
          is_sale: form.isSale,
          sort_order: Number(form.sortOrder || 0),
        })
        .eq("id", productId)
        .select("id");

      if (error) {
        setErrorMessage(`Не вдалося зберегти зміни: ${error.message}`);
        return;
      }

      alert("Зміни успішно збережено!");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Помилка збереження товару:", error);
      setErrorMessage("Сталася помилка під час збереження товару.");
    } finally {
      setSaving(false);
    }
  }

  const mainCategories = categories.filter(
    (category) => category.parent_id === null
  );

  const selectedMainCategory = mainCategories.find(
    (category) =>
      category.slug === form.category || category.title === form.category
  );

  const selectedSubcategories = selectedMainCategory
    ? categories.filter(
        (category) => category.parent_id === selectedMainCategory.id
      )
    : [];

  const currentCategoryExists = mainCategories.some(
    (category) =>
      category.slug === form.category || category.title === form.category
  );

  const currentSubcategoryExists = selectedSubcategories.some(
    (category) =>
      category.title === form.subcategory || category.slug === form.subcategory
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] p-8">
        {" "}
        <p className="text-gray-600">Завантаження товару...</p>{" "}
      </div>
    );
  }

  if (errorMessage && !form.name) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] p-8">
        {" "}
        <p className="text-red-600">{errorMessage}</p>{" "}
        <Link
          href="/admin/products"
          className="mt-4 inline-block text-[#66852A] hover:underline"
        >
          Повернутися до товарів{" "}
        </Link>{" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] p-4 sm:p-8">
      {" "}
      <div className="mx-auto max-w-5xl">
        {" "}
        <div className="mb-8">
          {" "}
          <Link
            href="/admin/products"
            className="text-sm text-[#66852A] hover:underline"
          >
            ← Назад до товарів{" "}
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-[#4A3528]">
            Редагувати товар
          </h1>
          <p className="mt-2 text-gray-600">
            Змініть дані товару та збережіть оновлення.
          </p>
        </div>
        {errorMessage && (
          <p className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#4A3528]">
              Основна інформація
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="productName" className={labelClass}>
                  Назва товару *
                </label>
                <input
                  id="productName"
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Назва товару"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="productBrand" className={labelClass}>
                  Бренд
                </label>
                <input
                  id="productBrand"
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="productSku" className={labelClass}>
                  Артикул (SKU)
                </label>
                <input
                  id="productSku"
                  value={form.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="productCategory" className={labelClass}>
                  Категорія *
                </label>
                <select
                  id="productCategory"
                  required
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Оберіть категорію</option>
                  {categoriesLoading ? (
                    <option value="" disabled>
                      Завантаження категорій...
                    </option>
                  ) : (
                    mainCategories.map((item) => (
                      <option key={item.id} value={item.slug}>
                        {item.title}
                      </option>
                    ))
                  )}
                  {form.category && !currentCategoryExists && (
                    <option value={form.category}>{form.category}</option>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="productSubcategory" className={labelClass}>
                  Підкатегорія
                </label>
                <select
                  id="productSubcategory"
                  value={form.subcategory}
                  onChange={(e) => updateField("subcategory", e.target.value)}
                  disabled={!form.category || categoriesLoading}
                  className={inputClass}
                >
                  <option value="">Оберіть підкатегорію</option>
                  {selectedSubcategories.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                  {form.subcategory && !currentSubcategoryExists && (
                    <option value={form.subcategory}>{form.subcategory}</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#4A3528]">
              Ціна та наявність
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="productPrice" className={labelClass}>
                  Ціна *
                </label>
                <input
                  id="productPrice"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="productOldPrice" className={labelClass}>
                  Стара ціна
                </label>
                <input
                  id="productOldPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.oldPrice}
                  onChange={(e) => updateField("oldPrice", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="productCurrency" className={labelClass}>
                  Валюта
                </label>
                <select
                  id="productCurrency"
                  value={form.currency}
                  onChange={(e) => updateField("currency", e.target.value)}
                  className={inputClass}
                >
                  <option value="UAH">₴ Гривня</option>
                  <option value="USD">$ Долар США</option>
                  <option value="EUR">€ Євро</option>
                </select>
              </div>

              <div>
                <label htmlFor="productAvailability" className={labelClass}>
                  Наявність
                </label>
                <select
                  id="productAvailability"
                  value={form.availability}
                  onChange={(e) => updateField("availability", e.target.value)}
                  className={inputClass}
                >
                  <option value="В наявності">В наявності</option>
                  <option value="Немає в наявності">Немає в наявності</option>
                  <option value="Під замовлення">Під замовлення</option>
                </select>
              </div>

              <div>
                <label htmlFor="productStock" className={labelClass}>
                  Кількість на складі
                </label>
                <input
                  id="productStock"
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={(e) => updateField("stockQuantity", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#4A3528]">
              Зображення товару
            </h2>

            <div className="mt-6 space-y-5">
              {(
                [
                  ["image1", "Зображення 1 — основне"],
                  ["image2", "Зображення 2"],
                  ["image3", "Зображення 3"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label htmlFor={key} className={labelClass}>
                    {label}
                  </label>
                  <input
                    id={key}
                    type="url"
                    value={form[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    placeholder="https://example.com/product.jpg"
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#4A3528]">
              Опис товару
            </h2>

            <div className="mt-6 space-y-5">
              {(
                [
                  ["shortDescription", "Короткий опис"],
                  ["description", "Опис"],
                  ["advantages", "Переваги"],
                  ["characteristics", "Характеристики"],
                  ["composition", "Склад"],
                  ["feedingRecommendations", "Рекомендації щодо годування"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label htmlFor={key} className={labelClass}>
                    {label}
                  </label>
                  <textarea
                    id={key}
                    rows={key === "description" ? 5 : 3}
                    value={form[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#4A3528]">
              Відображення товару
            </h2>

            <div className="mt-6 space-y-4">
              {(
                [
                  ["isActive", "Активний на сайті"],
                  ["isPopular", "Популярний товар"],
                  ["isNew", "Новинка"],
                  ["isSale", "Акційний товар"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-4 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => updateField(key, e.target.checked)}
                    className="h-4 w-4 accent-[#66852A]"
                  />
                  <span className="text-gray-800">{label}</span>
                </label>
              ))}
            </div>

            <div className="mt-6 max-w-sm">
              <label htmlFor="sortOrder" className={labelClass}>
                Порядок сортування
              </label>
              <input
                id="sortOrder"
                type="number"
                min="0"
                value={form.sortOrder}
                onChange={(e) => updateField("sortOrder", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Link
              href="/admin/products"
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-600 hover:bg-gray-50"
            >
              Скасувати
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#66852A] px-6 py-3 font-medium text-white hover:bg-[#587522] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Збереження..." : "Зберегти зміни"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
