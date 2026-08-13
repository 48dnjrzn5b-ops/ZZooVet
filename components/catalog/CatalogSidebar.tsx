"use client";

import Link from "next/link";
import { useState } from "react";
import PriceFilter from "./PriceFilter";

import { catalogCategories } from "../../data/catalogCategories";

type CatalogSidebarProps = {
  currentCategory: string;
};

export default function CatalogSidebar({
  currentCategory,
}: CatalogSidebarProps) {
  // Яка категорія зараз розкрита
  const [openCategory, setOpenCategory] = useState(currentCategory);

  return (
    <aside
      className="
      hidden
      w-64
      shrink-0
      lg:block
    "
    >
      {/* Заголовок sidebar */}
      <h2 className="mb-4 text-lg font-semibold">Категорії</h2>

      {/* Тут твій nav */}
      <nav className="space-y-1">
        {Object.entries(catalogCategories).map(
          ([categorySlug, categoryData]) => {
            // Перевіряємо активну категорію
            const isActive = currentCategory === categorySlug;

            // Перевіряємо відкриту категорію
            const isOpen = openCategory === categorySlug;

            // Чи є підкатегорії
            const hasSubcategories = categoryData.subcategories.length > 0;

            return (
              <div key={categorySlug}>
                {/* Основна категорія */}
                <div
                  className={`
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    transition-colors
                    ${isActive ? "bg-[#F1E7D8]" : "hover:bg-[#F8F3EC]"}
                  `}
                >
                  {/* Назва категорії */}
                  <Link
                    href={`/catalog/${categorySlug}`}
                    className={`
                      flex-1
                      px-3
                      py-2.5
                      text-sm
                      ${
                        isActive
                          ? "font-semibold text-[#B58A32]"
                          : "text-foreground"
                      }
                    `}
                  >
                    {categoryData.title}
                  </Link>

                  {/* Стрілочка */}
                  {hasSubcategories && (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenCategory(isOpen ? "" : categorySlug)
                      }
                      className="
                        px-3
                        py-2.5
                        text-muted-foreground
                      "
                      aria-label={
                        isOpen ? "Згорнути категорію" : "Розгорнути категорію"
                      }
                    >
                      <span
                        className={`
                          inline-block
                          text-lg
                          transition-transform
                          duration-200
                          ${isOpen ? "rotate-90" : ""}
                        `}
                      >
                        ›
                      </span>
                    </button>
                  )}
                </div>

                {/* Підкатегорії */}
                {isOpen && hasSubcategories && (
                  <div
                    className="
                      ml-4
                      mt-1
                      space-y-1
                      border-l
                      border-border
                      pl-3
                    "
                  >
                    {categoryData.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.slug}
                        href={`/catalog/${categorySlug}?subcategory=${subcategory.slug}`}
                        className="
                            block
                            rounded-lg
                            px-2
                            py-1.5
                            text-sm
                            text-muted-foreground
                            transition
                            hover:bg-[#F8F3EC]
                            hover:text-foreground
                          "
                      >
                        {subcategory.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
        )}
      </nav>
      <PriceFilter />
    </aside>
  );
}
