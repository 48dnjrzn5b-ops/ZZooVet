"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import PriceFilter from "./PriceFilter";
import { filterFieldLabels, getFilterTitle } from "../../data/filtersConfig";
import { createClient } from "@/lib/supabase/client";
import type { CatalogProduct } from "@/lib/supabase/products";

type Category = {
  id: string;
  title: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
};

type CatalogSidebarProps = {
  currentCategory: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onApplyFilters?: () => void;
  products: CatalogProduct[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (key: string, value: string) => void;
  minPrice: number | null;
  maxPrice: number | null;
  onPriceApply: (minPrice: number | null, maxPrice: number | null) => void;
};

const inputClass =
  "h-4 w-4 rounded border-border text-[#B58A32] focus:ring-[#B58A32]";

export default function CatalogSidebar({
  currentCategory,
  isOpenMobile = false,
  onCloseMobile = () => {},
  onApplyFilters = () => {},
  products,
  selectedFilters,
  onFilterChange,
  minPrice,
  maxPrice,
  onPriceApply,
}: CatalogSidebarProps) {
  const searchParams = useSearchParams();
  const currentSubcategory = searchParams.get("subcategory");

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [manuallyOpenedCategory, setManuallyOpenedCategory] = useState<
    string | null
  >(null);

  const openCategory = manuallyOpenedCategory ?? currentCategory;

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
        console.error(
          "Не вдалося завантажити категорії каталогу:",
          error.message
        );
        setCategories([]);
      } else {
        setCategories(data ?? []);
      }

      setCategoriesLoading(false);
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const mainCategories = categories.filter(
    (category) => category.parent_id === null
  );

  // Формуємо фільтри з реальних товарів поточної сторінки.
  const dynamicFilters = [
    {
      key: "brand",
      title: getFilterTitle("brand"),
      options: [
        ...new Set(
          products.map((product) => product.brand?.trim() ?? "").filter(Boolean)
        ),
      ].sort((a, b) => a.localeCompare(b, "uk")),
    },
    ...Object.entries(filterFieldLabels)
      .filter(([key]) => key !== "brand")
      .map(([key, title]) => ({
        key,
        title,
        options: [
          ...new Set(
            products
              .map((product) => {
                const value = product.attributes?.[key];
                return typeof value === "string" ? value.trim() : "";
              })
              .filter(Boolean)
          ),
        ].sort((a, b) => a.localeCompare(b, "uk")),
      })),
  ].filter((group) => group.options.length > 0);

  const sidebarContent = (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Категорії</h2>

        {categoriesLoading ? (
          <p className="text-sm text-muted-foreground">
            Завантаження категорій...
          </p>
        ) : mainCategories.length > 0 ? (
          <nav className="space-y-1">
            {mainCategories.map((category) => {
              const isActive = currentCategory === category.slug;
              const isOpen = openCategory === category.slug;

              const subcategories = categories.filter(
                (item) => item.parent_id === category.id
              );

              const hasSubcategories = subcategories.length > 0;

              return (
                <div key={category.id}>
                  <div
                    className={`flex items-center justify-between rounded-xl transition-colors ${
                      isActive ? "bg-[#F1E7D8]" : "hover:bg-[#F8F3EC]"
                    }`}
                  >
                    <Link
                      href={`/catalog/${category.slug}`}
                      className={`flex-1 px-3 py-2.5 text-sm ${
                        isActive
                          ? "font-semibold text-[#B58A32]"
                          : "text-foreground"
                      }`}
                    >
                      {category.title}
                    </Link>

                    {hasSubcategories && (
                      <button
                        type="button"
                        onClick={() =>
                          setManuallyOpenedCategory(isOpen ? "" : category.slug)
                        }
                        className="px-3 py-2.5 text-muted-foreground"
                        aria-label={
                          isOpen ? "Згорнути категорію" : "Розгорнути категорію"
                        }
                        aria-expanded={isOpen}
                      >
                        <span
                          className={`inline-block text-lg transition-transform duration-200 ${
                            isOpen ? "rotate-90" : ""
                          }`}
                        >
                          ›
                        </span>
                      </button>
                    )}
                  </div>

                  {isOpen && hasSubcategories && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
                      {subcategories.map((subcategory) => {
                        const isSubActive =
                          currentSubcategory === subcategory.slug && isActive;

                        return (
                          <Link
                            key={subcategory.id}
                            href={`/catalog/${category.slug}?subcategory=${subcategory.slug}`}
                            className={`block rounded-lg px-2 py-1.5 text-sm transition ${
                              isSubActive
                                ? "bg-[#F1E7D8]/50 font-semibold text-[#B58A32]"
                                : "text-muted-foreground hover:bg-[#F8F3EC] hover:text-foreground"
                            }`}
                          >
                            {subcategory.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        ) : (
          <p className="text-sm text-muted-foreground">
            Не вдалося знайти активні категорії.
          </p>
        )}
      </div>

      <div className="space-y-6 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Фільтри</h3>

          {Object.values(selectedFilters).some(
            (values) => values.length > 0
          ) && (
            <button
              type="button"
              onClick={() => {
                Object.entries(selectedFilters).forEach(([key, values]) => {
                  values.forEach((value) => onFilterChange(key, value));
                });
              }}
              className="text-xs font-medium text-[#B58A32] hover:underline"
            >
              Очистити
            </button>
          )}
        </div>

        {dynamicFilters.length > 0 ? (
          dynamicFilters.map((group) => (
            <div key={group.key} className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">
                {group.title}
              </h4>

              <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                {group.options.map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={(selectedFilters[group.key] ?? []).includes(
                        option
                      )}
                      onChange={() => onFilterChange(group.key, option)}
                      className={inputClass}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Для цієї категорії поки немає доступних характеристик для
            фільтрації.
          </p>
        )}
      </div>

      <div className="border-t border-border pt-6">
        <PriceFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          onApply={onPriceApply}
        />
      </div>

      <div className="pt-4 lg:hidden">
        <button
          type="button"
          onClick={onApplyFilters}
          className="w-full rounded-xl bg-[#B58A32] py-3 font-semibold text-white shadow transition hover:opacity-90"
        >
          Застосувати фільтри
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">{sidebarContent}</aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Закрити фільтри"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCloseMobile}
          />

          <div className="relative z-10 ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-xl font-bold">Фільтри та категорії</h3>

              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Закрити"
                className="px-2 text-2xl text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
