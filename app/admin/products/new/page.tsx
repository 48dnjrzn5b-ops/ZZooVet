"use client";

import ProductImageUpload from "@/components/admin/ProductImageUpload";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  title: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
};

type ProductField = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "select";
  options?: string[];
};

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Record<string, string>>({});

  // Завантаження категорій і підкатегорій
  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Не вдалося завантажити категорії");
        }

        const rows: Category[] = Array.isArray(result)
          ? result
          : result.categories ?? result.data ?? [];

        if (!cancelled) {
          setCategories(rows.filter((item) => item.is_active));
        }
      } catch (error) {
        if (!cancelled) {
          setCategoriesError(
            error instanceof Error
              ? error.message
              : "Помилка завантаження категорій"
          );
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const mainCategories = categories
    .filter((item) => item.parent_id === null)
    .sort((a, b) => a.sort_order - b.sort_order);

  const selectedCategory = mainCategories.find(
    (item) => item.slug === category
  );

  const subcategories = categories
    .filter((item) => item.parent_id === selectedCategory?.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  const handleFieldChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked ? "true" : "false",
    }));
  };

  const commonFields: ProductField[] = [
    {
      key: "age",
      label: "Вік тварини",
      type: "select",
      options: ["Малюки", "Молоді", "Дорослі", "Літні", "Для будь-якого віку"],
    },
    {
      key: "animalSize",
      label: "Розмір тварини",
      type: "select",
      options: [
        "Міні",
        "Мала",
        "Середня",
        "Велика",
        "Гігантська",
        "Універсальний",
      ],
    },
    {
      key: "animalWeight",
      label: "Для ваги тварини",
      placeholder: "Наприклад: 10–25 кг",
    },
  ];

  const foodFields: ProductField[] = [
    {
      key: "foodType",
      label: "Тип корму",
      type: "select",
      options: ["Сухий", "Вологий", "Напіввологий", "Ласощі", "Інший"],
    },
    {
      key: "flavor",
      label: "Смак / основний білок",
      placeholder: "Наприклад: курка, лосось",
    },
    {
      key: "weight",
      label: "Вага упаковки",
      placeholder: "Наприклад: 2 кг",
    },
    {
      key: "purpose",
      label: "Призначення",
      placeholder: "Наприклад: для стерилізованих тварин",
    },
    {
      key: "specialNeeds",
      label: "Особливі потреби",
      placeholder: "Наприклад: беззерновий, гіпоалергенний",
    },
  ];

  const clothingFields: ProductField[] = [
    {
      key: "clothingSize",
      label: "Розмір одягу",
      placeholder: "Наприклад: XS, S, M, L",
    },
    {
      key: "color",
      label: "Колір",
      placeholder: "Наприклад: зелений",
    },
    {
      key: "material",
      label: "Матеріал",
      placeholder: "Наприклад: бавовна, фліс",
    },
    ...commonFields.slice(1, 2),
  ];

  const cageFields: ProductField[] = [
    {
      key: "animalSpecies",
      label: "Для якого виду тварин",
      placeholder: "Наприклад: хом'як, морська свинка, папуга",
    },
    {
      key: "productSize",
      label: "Розмір товару",
      placeholder: "Наприклад: 60 × 40 × 50 см",
    },
    {
      key: "material",
      label: "Матеріал",
      placeholder: "Наприклад: метал, пластик",
    },
  ];

  const aquariumFields: ProductField[] = [
    {
      key: "volume",
      label: "Об'єм акваріума",
      placeholder: "Наприклад: 60 л",
    },
    {
      key: "productSize",
      label: "Розміри",
      placeholder: "Наприклад: 60 × 30 × 40 см",
    },
    {
      key: "material",
      label: "Матеріал",
      placeholder: "Наприклад: скло, акрил",
    },
  ];

  const accessoryFields: ProductField[] = [
    {
      key: "productSize",
      label: "Розмір товару",
      placeholder: "Вкажіть розмір або габарити",
    },
    {
      key: "material",
      label: "Матеріал",
      placeholder: "Наприклад: нейлон, метал, пластик",
    },
    {
      key: "color",
      label: "Колір",
      placeholder: "Наприклад: чорний",
    },
  ];

  const getFieldsForProduct = (
    categorySlug: string,
    subcategoryTitle: string
  ): ProductField[] => {
    if (!categorySlug || !subcategoryTitle) return [];

    if (subcategoryTitle.includes("Корм")) {
      if (categorySlug === "fish") {
        return [
          ...foodFields.filter((field) => field.key !== "age"),
          {
            key: "fishType",
            label: "Для яких риб",
            placeholder: "Наприклад: тропічні, донні",
          },
          {
            key: "foodForm",
            label: "Форма корму",
            type: "select",
            options: ["Пластівці", "Гранули", "Таблетки", "Палички", "Інший"],
          },
        ];
      }

      return [...commonFields, ...foodFields];
    }

    if (subcategoryTitle.includes("Ласощі")) {
      return [
        ...commonFields.slice(0, 2),
        foodFields[1],
        foodFields[2],
        foodFields[4],
      ];
    }

    if (subcategoryTitle.includes("Одяг")) {
      return clothingFields;
    }

    if (
      subcategoryTitle.includes("Клітки") ||
      subcategoryTitle.includes("Клітка")
    ) {
      return cageFields;
    }

    if (subcategoryTitle.includes("Акваріуми")) {
      return aquariumFields;
    }

    if (
      subcategoryTitle.includes("Лежанки") ||
      subcategoryTitle.includes("М'які місця") ||
      subcategoryTitle.includes("будиночки")
    ) {
      return [
        ...commonFields.slice(1, 2),
        {
          key: "productSize",
          label: "Розмір товару",
          placeholder: "Наприклад: 60 × 40 см",
        },
        ...accessoryFields.filter((field) => field.key !== "productSize"),
      ];
    }

    if (
      subcategoryTitle.includes("Амуніція") ||
      subcategoryTitle.includes("нашийники") ||
      subcategoryTitle.includes("повідці")
    ) {
      return [
        ...commonFields.slice(1, 2),
        {
          key: "productSize",
          label: "Розмір / довжина",
          placeholder: "Наприклад: 2 м, розмір M",
        },
        ...accessoryFields.filter((field) => field.key !== "productSize"),
      ];
    }

    if (
      subcategoryTitle.includes("Наповнювачі") ||
      subcategoryTitle.includes("Наповнювач")
    ) {
      return [
        {
          key: "material",
          label: "Тип / матеріал наповнювача",
          placeholder: "Наприклад: деревний, силікагелевий",
        },
        {
          key: "weight",
          label: "Вага упаковки",
          placeholder: "Наприклад: 5 кг",
        },
      ];
    }

    if (
      subcategoryTitle.includes("Акваріуми") ||
      subcategoryTitle.includes("Фільтри") ||
      subcategoryTitle.includes("Обігрівачі") ||
      subcategoryTitle.includes("Освітлення")
    ) {
      return [
        ...aquariumFields,
        {
          key: "purpose",
          label: "Призначення / сумісність",
          placeholder: "Наприклад: для акваріума 60–100 л",
        },
      ];
    }

    if (categorySlug === "fish") {
      return [
        {
          key: "purpose",
          label: "Призначення",
          placeholder: "Наприклад: декор, очищення води",
        },
        ...accessoryFields,
      ];
    }

    if (categorySlug === "birds" || categorySlug === "rodents") {
      return [
        {
          key: "animalSpecies",
          label: "Для якого виду тварин",
          placeholder:
            categorySlug === "birds"
              ? "Наприклад: папуга, канарка"
              : "Наприклад: хом'як, морська свинка",
        },
        ...accessoryFields,
      ];
    }

    return accessoryFields;
  };

  const productFields = getFieldsForProduct(category, subcategory);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCategory) {
      alert("Оберіть категорію товару.");
      return;
    }

    if (!subcategory) {
      alert("Оберіть підкатегорію товару.");
      return;
    }

    if (!formData.name?.trim()) {
      alert("Введіть назву товару.");
      return;
    }

    if (
      !formData.price ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      alert("Вкажіть коректну ціну товару.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      const attributes = Object.fromEntries(
        productFields
          .filter((field) => formData[field.key]?.trim())
          .map((field) => [field.key, formData[field.key].trim()])
      );

      const { error } = await supabase.from("products").insert({
        name: formData.name.trim(),
        brand: formData.brand?.trim() || null,
        sku: formData.sku?.trim() || null,
        category: selectedCategory.title,
        subcategory: subcategory || null,
        price: Number(formData.price),
        old_price: formData.oldPrice ? Number(formData.oldPrice) : null,
        currency: formData.currency || "UAH",
        availability: formData.availability || "В наявності",
        stock_quantity: Number(formData.stockQuantity || 0),
        image1: formData.image1 || null,
        image2: formData.image2 || null,
        image3: formData.image3 || null,
        short_description: formData.shortDescription || null,
        description: formData.description || null,
        advantages: formData.advantages || null,
        characteristics: formData.characteristics || null,
        attributes,
        composition: formData.composition || null,
        feeding_recommendations: formData.feedingRecommendations || null,
        is_active: formData.isActive !== "false",
        is_popular: formData.isPopular === "true",
        is_new: formData.isNew === "true",
        is_sale: formData.isSale === "true",
        sort_order: Number(formData.sortOrder || 0),
      });

      if (error) {
        alert(`Не вдалося зберегти товар: ${error.message}`);
        return;
      }

      alert("Товар успішно збережено!");

      setFormData({});
      setCategory("");
      setSubcategory("");
    } catch (error) {
      alert(
        error instanceof Error
          ? `Помилка: ${error.message}`
          : "Не вдалося зберегти товар."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] p-4 sm:p-8">
      <section className="mx-auto min-w-0 max-w-6xl">
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="text-sm text-[#66852A] hover:underline"
          >
            ← Назад до товарів
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-[#4A3528]">
            Додати товар
          </h1>

          <p className="mt-2 text-gray-600">
            Додайте новий товар до каталогу магазину.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ОСНОВНА ІНФОРМАЦІЯ */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#4A3528]">
              Основна інформація
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Основні дані товару та його категорія.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="productName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Назва товару
                </label>
                <input
                  id="productName"
                  type="text"
                  name="name"
                  required
                  value={formData.name ?? ""}
                  onChange={handleFieldChange}
                  placeholder="Наприклад: Корм для собак Brit Premium"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                />
              </div>

              <div>
                <label
                  htmlFor="productBrand"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Бренд
                </label>
                <input
                  id="productBrand"
                  type="text"
                  name="brand"
                  value={formData.brand ?? ""}
                  onChange={handleFieldChange}
                  placeholder="Наприклад: Brit Premium"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                />
              </div>

              <div>
                <label
                  htmlFor="productSku"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Артикул (SKU)
                </label>
                <input
                  id="productSku"
                  type="text"
                  name="sku"
                  value={formData.sku ?? ""}
                  onChange={handleFieldChange}
                  placeholder="Наприклад: BRIT-DOG-001"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                />
              </div>

              <div>
                <label
                  htmlFor="productCategory"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Категорія
                </label>

                <select
                  id="productCategory"
                  name="category"
                  value={category}
                  onChange={(event) => {
                    const value = event.target.value;

                    setCategory(value);
                    setSubcategory("");

                    setFormData((prev) => ({
                      ...prev,
                      category: value,
                      subcategory: "",
                    }));
                  }}
                  disabled={categoriesLoading || Boolean(categoriesError)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A] disabled:bg-gray-100"
                >
                  <option value="">
                    {categoriesLoading
                      ? "Завантаження категорій..."
                      : categoriesError
                      ? "Не вдалося завантажити категорії"
                      : "Оберіть категорію"}
                  </option>

                  {mainCategories.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.title}
                    </option>
                  ))}
                </select>

                {categoriesError && (
                  <p className="mt-2 text-sm text-red-600">{categoriesError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="productSubcategory"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Підкатегорія
                </label>

                <select
                  id="productSubcategory"
                  name="subcategory"
                  value={subcategory}
                  onChange={(event) => {
                    const value = event.target.value;

                    setSubcategory(value);

                    setFormData((prev) => ({
                      ...prev,
                      subcategory: value,
                    }));
                  }}
                  disabled={
                    !category || categoriesLoading || Boolean(categoriesError)
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A] disabled:bg-gray-100"
                >
                  <option value="">
                    {category
                      ? "Оберіть підкатегорію"
                      : "Спочатку оберіть категорію"}
                  </option>

                  {subcategories.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ХАРАКТЕРИСТИКИ ТА ФІЛЬТРИ */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#4A3528]">
              Характеристики та фільтри
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Поля змінюються залежно від категорії та підкатегорії товару.
            </p>

            {!category || !subcategory ? (
              <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                Спочатку оберіть категорію та підкатегорію товару.
              </div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {productFields.map((field) => (
                  <div key={field.key}>
                    <label
                      htmlFor={`field-${field.key}`}
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>

                    {field.type === "select" ? (
                      <select
                        id={`field-${field.key}`}
                        name={field.key}
                        value={formData[field.key] ?? ""}
                        onChange={handleFieldChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                      >
                        <option value="">Оберіть значення</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={`field-${field.key}`}
                        type="text"
                        name={field.key}
                        placeholder={field.placeholder ?? ""}
                        value={formData[field.key] ?? ""}
                        onChange={handleFieldChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ЦІНА ТА НАЯВНІСТЬ */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#4A3528]">
              Ціна та наявність
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Вартість товару та інформація про його наявність на складі.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="productPrice"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Ціна
                </label>
                <input
                  id="productPrice"
                  type="number"
                  name="price"
                  value={formData.price ?? ""}
                  onChange={handleFieldChange}
                  placeholder="899"
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                />
              </div>

              <div>
                <label
                  htmlFor="productOldPrice"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Стара ціна
                </label>
                <input
                  id="productOldPrice"
                  type="number"
                  name="oldPrice"
                  value={formData.oldPrice ?? ""}
                  onChange={handleFieldChange}
                  placeholder="999"
                  min="0"
                  step="0.01"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Заповнюйте, якщо товар продається зі знижкою.
                </p>
              </div>

              <div>
                <label
                  htmlFor="productCurrency"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Валюта
                </label>
                <select
                  id="productCurrency"
                  name="currency"
                  value={formData.currency ?? "UAH"}
                  onChange={handleFieldChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                >
                  <option value="UAH">₴ Гривня</option>
                  <option value="USD">$ Долар США</option>
                  <option value="EUR">€ Євро</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="productAvailability"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Наявність
                </label>
                <select
                  id="productAvailability"
                  name="availability"
                  value={formData.availability ?? "В наявності"}
                  onChange={handleFieldChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                >
                  <option value="В наявності">В наявності</option>
                  <option value="Немає в наявності">Немає в наявності</option>
                  <option value="Під замовлення">Під замовлення</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="productStock"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Кількість на складі
                </label>
                <input
                  id="productStock"
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity ?? ""}
                  onChange={handleFieldChange}
                  placeholder="15"
                  min="0"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                />
              </div>
            </div>
          </div>

          {/* ЗОБРАЖЕННЯ */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#4A3528]">
              Зображення товару
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Додайте до трьох зображень товару. Перше зображення буде основним.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <ProductImageUpload
                label="Зображення 1 — основне"
                value={formData.image1 ?? ""}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, image1: url }))
                }
              />

              <ProductImageUpload
                label="Зображення 2"
                value={formData.image2 ?? ""}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, image2: url }))
                }
              />

              <ProductImageUpload
                label="Зображення 3"
                value={formData.image3 ?? ""}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, image3: url }))
                }
              />
            </div>
          </div>

          {/* ОПИС ТОВАРУ */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#4A3528]">
              Опис товару
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Детальна інформація про товар, його переваги, склад та
              рекомендації.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="shortDescription"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Короткий опис
                </label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription ?? ""}
                  onChange={handleFieldChange}
                  placeholder="Коротко про товар"
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Опис
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description ?? ""}
                  onChange={handleFieldChange}
                  placeholder="Детальний опис товару"
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                />
              </div>

              <div>
                <label
                  htmlFor="advantages"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Переваги
                </label>
                <textarea
                  id="advantages"
                  name="advantages"
                  value={formData.advantages ?? ""}
                  onChange={handleFieldChange}
                  placeholder="Основні переваги товару"
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                />
              </div>

              <div>
                <label
                  htmlFor="characteristics"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Характеристики
                </label>
                <textarea
                  id="characteristics"
                  name="characteristics"
                  value={formData.characteristics ?? ""}
                  onChange={handleFieldChange}
                  placeholder="Основні характеристики товару"
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                />
              </div>

              <div>
                <label
                  htmlFor="composition"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Склад
                </label>
                <textarea
                  id="composition"
                  name="composition"
                  value={formData.composition ?? ""}
                  onChange={handleFieldChange}
                  placeholder="Склад товару"
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                />
              </div>

              <div>
                <label
                  htmlFor="feedingRecommendations"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Рекомендації щодо годування
                </label>
                <textarea
                  id="feedingRecommendations"
                  name="feedingRecommendations"
                  value={formData.feedingRecommendations ?? ""}
                  onChange={handleFieldChange}
                  placeholder="Рекомендації щодо годування"
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
                />
              </div>
            </div>
          </div>

          {/* ВІДОБРАЖЕННЯ ТОВАРУ */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#4A3528]">
              Відображення товару
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Налаштуйте, як товар відображатиметься в каталозі магазину.
            </p>

            <div className="mt-6 space-y-4">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 p-4 hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive !== "false"}
                  onChange={handleCheckboxChange}
                  className="mt-1 accent-[#66852A]"
                />
                <div>
                  <p className="font-medium text-gray-800">Активний на сайті</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Якщо вимкнути, товар не відображатиметься покупцям у
                    каталозі.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 p-4 hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={formData.isPopular === "true"}
                  onChange={handleCheckboxChange}
                  className="mt-1 accent-[#66852A]"
                />
                <div>
                  <p className="font-medium text-gray-800">Популярний товар</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Товар можна буде показувати в блоці популярних товарів.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 p-4 hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew === "true"}
                  onChange={handleCheckboxChange}
                  className="mt-1 accent-[#66852A]"
                />
                <div>
                  <p className="font-medium text-gray-800">Новинка</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Позначає товар як новий у каталозі.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 p-4 hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="isSale"
                  checked={formData.isSale === "true"}
                  onChange={handleCheckboxChange}
                  className="mt-1 accent-[#66852A]"
                />
                <div>
                  <p className="font-medium text-gray-800">Товар зі знижкою</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Позначає товар як акційний для відповідного розділу
                    магазину.
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-6 max-w-sm">
              <label
                htmlFor="sortOrder"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Порядок сортування
              </label>
              <input
                id="sortOrder"
                type="number"
                name="sortOrder"
                value={formData.sortOrder ?? "0"}
                onChange={handleFieldChange}
                min="0"
                placeholder="0"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
              />
              <p className="mt-1 text-xs text-gray-400">
                Менше число — вище розташування товару, якщо такий порядок буде
                використано в каталозі.
              </p>
            </div>
          </div>

          {/* КНОПКИ */}
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Link
              href="/admin/products"
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-600 hover:bg-gray-50"
            >
              Скасувати
            </Link>

            <button
              type="submit"
              disabled={saving || categoriesLoading || Boolean(categoriesError)}
              className="rounded-xl bg-[#66852A] px-6 py-3 font-medium text-white hover:bg-[#587522] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Збереження..." : "Зберегти товар"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
