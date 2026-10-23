"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { navigation } from "@/data/navigation";

type Category = {
  id: string;
  title: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
};

export default function CategoryNav() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("categories")
        .select("id, title, slug, parent_id, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Помилка завантаження категорій:", error.message);
        return;
      }

      setCategories(data ?? []);
    }

    loadCategories();
  }, []);

  const mainCategories = categories.filter(
    (category) => category.parent_id === null
  );

  return (
    <nav className="relative hidden bg-[#66852A] lg:block">
      {/* ОСНОВНА НАВІГАЦІЯ */}
      <div className="flex items-center justify-center overflow-x-auto scrollbar-hide">
        {navigation.map((item) => {
          const isCatalog = item.href === "/catalog";

          return (
            <div key={item.href} className="relative shrink-0">
              {isCatalog ? (
                <div
                  className="relative"
                  onMouseEnter={() => setIsMegaMenuOpen(true)}
                >
                  <Link
                    href={item.href}
                    className="relative flex items-center justify-center px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 lg:px-5 lg:py-3.5 lg:text-base"
                  >
                    {item.title}
                  </Link>

                  {isMegaMenuOpen && (
                    <div className="absolute left-0 top-full z-40 h-3 w-full" />
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 lg:px-5 lg:py-3.5 lg:text-base"
                >
                  {item.title}
                </Link>
              )}
            </div>
          );
        })}

        {/* АКЦІЇ */}
        <Link
          href="/sale"
          className="my-3 ml-3 mr-3 flex shrink-0 items-center justify-center rounded-md bg-[#F77601] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 lg:mr-0 lg:px-5 lg:py-3 lg:text-base"
        >
          Акції
        </Link>
      </div>

      {/* MEGA MENU */}
      {isMegaMenuOpen && (
        <div
          className="absolute left-0 top-full z-50 w-full border-t border-gray-200 bg-white shadow-xl"
          onMouseLeave={() => setIsMegaMenuOpen(false)}
        >
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-2 gap-x-10 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {mainCategories.map((category) => {
                const subcategories = categories.filter(
                  (subcategory) => subcategory.parent_id === category.id
                );

                return (
                  <div key={category.id}>
                    {/* ОСНОВНА КАТЕГОРІЯ */}
                    <Link
                      href={`/catalog/${category.slug}`}
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="mb-3 block text-base font-semibold text-gray-900 transition-colors hover:text-[#66852A]"
                    >
                      {category.title}
                    </Link>

                    {/* ПІДКАТЕГОРІЇ */}
                    {subcategories.length > 0 && (
                      <div className="space-y-1.5">
                        {subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/catalog/${category.slug}?subcategory=${subcategory.slug}`}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="block text-sm text-gray-500 transition-colors hover:text-[#66852A]"
                          >
                            {subcategory.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
