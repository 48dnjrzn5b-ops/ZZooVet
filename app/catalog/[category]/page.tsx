"use client";

import { useState, use, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import CatalogSidebar from "@/components/catalog/CatalogSidebar";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, type CatalogProduct } from "@/lib/supabase/products";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    subcategory?: string;
  }>;
};

type Subcategory = {
  title: string;
  slug: string;
};

type Category = {
  id: string;
  title: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
};

type CategoryData = {
  id: string;
  title: string;
  slug: string;
  subcategories: Subcategory[];
};

export default function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = use(params);
  const { subcategory: subcategorySlug } = use(searchParams);

  const urlSearchParams = useSearchParams();
  const searchQuery = urlSearchParams.get("search")?.trim() || "";

  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  // Фільтр ціни
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // Вибрані фільтри характеристик
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  // Зміна вибраних фільтрів
  function handleFilterChange(key: string, value: string) {
    setSelectedFilters((previous) => {
      const currentValues = previous[key] ?? [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...previous,
        [key]: nextValues,
      };
    });
  }

  // Застосування діапазону ціни
  function handlePriceApply(min: number | null, max: number | null) {
    setMinPrice(min);
    setMaxPrice(max);
  }

  // Скидання всіх фільтрів
  function clearFilters() {
    setSelectedFilters({});
    setMinPrice(null);
    setMaxPrice(null);
  }

  // Завантаження товарів із Supabase
  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setLoadError(false);

        const data = await getProducts();

        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Не вдалося завантажити товари:", error);

        if (isMounted) {
          setLoadError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Завантаження активних категорій і підкатегорій із Supabase
  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("categories")
          .select("id, title, slug, parent_id, sort_order, is_active")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (error) {
          throw error;
        }

        if (isMounted) {
          setCategories(data ?? []);
        }
      } catch (error) {
        console.error("Не вдалося завантажити категорії:", error);
      } finally {
        if (isMounted) {
          setIsCategoriesLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Формування структури категорій із даних Supabase
  const categoriesRecord = useMemo(() => {
    const record: Record<string, CategoryData> = {};

    const mainCategories = categories.filter((item) => item.parent_id === null);

    for (const mainCategory of mainCategories) {
      record[mainCategory.slug] = {
        id: mainCategory.id,
        title: mainCategory.title,
        slug: mainCategory.slug,
        subcategories: categories
          .filter((item) => item.parent_id === mainCategory.id)
          .map((item) => ({
            title: item.title,
            slug: item.slug,
          })),
      };
    }

    return record;
  }, [categories]);

  const currentCategoryData = categoriesRecord[category];

  // Товари поточної категорії та підкатегорії
  const baseProducts = useMemo(() => {
    // Акційні товари
    if (category === "sale") {
      return products.filter((product) => product.is_sale);
    }

    // Популярні товари
    if (category === "popular") {
      return products.filter((product) => product.is_popular);
    }

    // Новинки
    if (category === "new") {
      return products.filter((product) => product.is_new);
    }

    // Звичайні категорії
    if (!currentCategoryData) {
      return [];
    }

    // Сумісність зі старими значеннями категорій у товарах
    const categoryAliases: Record<string, string[]> = {
      dogs: ["dog", "dogs", "собакам", "собаки"],
      cats: ["cat", "cats", "котам", "коти", "кошкам"],
      rodents: ["rodent", "rodents", "гризунам", "гризуны"],
      birds: ["bird", "birds", "птахам", "птицам"],
      fish: ["fish", "рибам", "рыбам"],
    };

    const allowedCategories = [
      ...(categoryAliases[category] ?? []),
      currentCategoryData.title.trim().toLowerCase(),
    ];

    let result = products.filter((product) =>
      allowedCategories.includes((product.category ?? "").trim().toLowerCase())
    );

    // Фільтр підкатегорії
    if (subcategorySlug) {
      const selectedSubcategory = currentCategoryData.subcategories.find(
        (sub) => sub.slug === subcategorySlug
      );

      if (!selectedSubcategory) {
        return [];
      }

      result = result.filter(
        (product) =>
          (product.subcategory ?? "").trim().toLowerCase() ===
          selectedSubcategory.title.trim().toLowerCase()
      );
    }

    return result;
  }, [products, currentCategoryData, category, subcategorySlug]);

  // Пошук, фільтри характеристик і ціни
  const filteredProducts = useMemo(() => {
    let result = [...baseProducts];

    // Пошук за назвою, брендом, категорією та підкатегорією
    if (searchQuery) {
      const searchWords = searchQuery
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      result = result.filter((product) => {
        const searchableText = [
          product.name,
          product.brand,
          product.category,
          product.subcategory,
        ]
          .join(" ")
          .toLowerCase();

        return searchWords.every((word) => searchableText.includes(word));
      });
    }

    // Фільтри бренду та характеристик
    result = result.filter((product) =>
      Object.entries(selectedFilters).every(([key, values]) => {
        if (values.length === 0) {
          return true;
        }

        const productValue =
          key === "brand" ? product.brand : product.attributes?.[key] ?? "";

        return values.includes(productValue.trim());
      })
    );

    // Мінімальна ціна
    if (minPrice !== null) {
      result = result.filter((product) => product.price >= minPrice);
    }

    // Максимальна ціна
    if (maxPrice !== null) {
      result = result.filter((product) => product.price <= maxPrice);
    }

    return result;
  }, [baseProducts, searchQuery, selectedFilters, minPrice, maxPrice]);

  // Сортування товарів
  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];

    if (sortOrder === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [filteredProducts, sortOrder]);

  // Очікуємо завантаження категорій
  if (isCategoriesLoading && !["sale", "popular", "new"].includes(category)) {
    return (
      <main className="px-6 py-10">
        <p className="text-muted-foreground">Завантаження категорії...</p>
      </main>
    );
  }

  // Якщо категорії немає в базі
  if (!currentCategoryData && !["sale", "popular", "new"].includes(category)) {
    return (
      <main className="px-6 py-10">
        <h1 className="text-2xl font-bold">Категорію не знайдено</h1>
      </main>
    );
  }

  // Заголовок сторінки
  let pageTitle =
    category === "sale"
      ? "Акційні товари"
      : category === "popular"
      ? "Популярні товари"
      : category === "new"
      ? "Новинки"
      : currentCategoryData!.title;

  if (subcategorySlug && currentCategoryData) {
    const sub = currentCategoryData.subcategories.find(
      (item) => item.slug === subcategorySlug
    );

    if (sub) {
      pageTitle = `${currentCategoryData.title} — ${sub.title}`;
    }
  }

  const displayTitle = searchQuery
    ? `Результати пошуку: «${searchQuery}»`
    : pageTitle;

  // Кількість активних фільтрів, включно з ціною
  const activeFiltersCount =
    Object.values(selectedFilters).reduce(
      (total, values) => total + values.length,
      0
    ) +
    (minPrice !== null ? 1 : 0) +
    (maxPrice !== null ? 1 : 0);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 font-heading text-3xl font-bold sm:text-4xl">
          {displayTitle}
        </h1>

        {/* Кількість результатів пошуку */}
        {searchQuery && !isLoading && !loadError && (
          <p className="mb-6 text-muted-foreground">
            Знайдено товарів:{" "}
            <span className="font-semibold text-foreground">
              {sortedProducts.length}
            </span>
          </p>
        )}

        {/* Мобільне керування */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-white p-3 shadow-sm lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#F8F3EC] px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-[#F1E7D8]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.172a1 1 0 01-.553.894l-4 2A1 1 0 017 18.172v-4.172a1 1 0 00-.293-.707L.293 7.293A1 1 0 010 6.586V4z"
              />
            </svg>
            Фільтри
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-[#B58A32] px-2 py-0.5 text-xs text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="max-w-[60%] cursor-pointer bg-transparent text-sm font-medium text-foreground focus:outline-none"
            aria-label="Сортування товарів"
          >
            <option value="default">Сортування</option>
            <option value="price-asc">Від дешевших до дорожчих</option>
            <option value="price-desc">Від дорожчих до дешевших</option>
          </select>
        </div>

        <div className="flex items-start gap-10">
          {/* Бічна панель */}
          <CatalogSidebar
            currentCategory={category}
            isOpenMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            onApplyFilters={() => setIsMobileFilterOpen(false)}
            products={baseProducts}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceApply={handlePriceApply}
          />

          {/* Список товарів */}
          <section className="min-w-0 flex-1">
            {/* Сортування на комп'ютері */}
            <div className="mb-6 hidden items-center justify-between rounded-2xl border border-border bg-white p-4 lg:flex">
              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  Знайдено товарів:{" "}
                  <span className="font-semibold text-foreground">
                    {sortedProducts.length}
                  </span>
                </p>

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-medium text-[#B58A32] hover:underline"
                  >
                    Скинути фільтри
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Сортувати:
                </span>

                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="cursor-pointer rounded-xl border border-border bg-background px-3 py-1.5 text-sm font-medium focus:border-[#B58A32] focus:outline-none"
                  aria-label="Сортування товарів"
                >
                  <option value="default">За замовчуванням</option>
                  <option value="price-asc">Від дешевших до дорожчих ↑</option>
                  <option value="price-desc">Від дорожчих до дешевших ↓</option>
                </select>
              </div>
            </div>

            {/* Завантаження, помилка або товари */}
            {isLoading ? (
              <p className="py-10 text-center text-muted-foreground">
                Завантаження товарів...
              </p>
            ) : loadError ? (
              <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center">
                <h2 className="mb-2 text-xl font-semibold">
                  Не вдалося завантажити товари
                </h2>

                <p className="text-muted-foreground">
                  Перевірте зʼєднання та спробуйте оновити сторінку.
                </p>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center">
                <h2 className="mb-2 text-xl font-semibold">
                  Товарів не знайдено
                </h2>

                <p className="text-muted-foreground">
                  Спробуйте змінити пошуковий запит або вибрати інші фільтри.
                </p>

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 rounded-xl bg-[#B58A32] px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
                  >
                    Скинути фільтри
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
