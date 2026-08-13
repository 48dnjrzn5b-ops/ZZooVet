"use client";

import Link from "next/link";
import { useState } from "react";

import { navigation } from "@/data/navigation";
import { catalogCategories } from "@/data/catalogCategories";

export default function CategoryNav() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  return (
    <nav
      className="
        relative
        bg-[#66852A]
      "
      onMouseLeave={() => setIsMegaMenuOpen(false)}
    >
      {/* ОСНОВНА НАВІГАЦІЯ */}
      <div
        className="
          flex
          items-center
          justify-center
          overflow-x-auto
          scrollbar-hide
        "
      >
        {navigation.map((item) => {
          const isCatalog = item.href === "/catalog";

          return (
            <div
              key={item.href}
              className="
                relative
                shrink-0
              "
              onMouseEnter={() => {
                if (isCatalog) {
                  setIsMegaMenuOpen(true);
                }
              }}
            >
              <Link
                href={item.href}
                className="
                  flex
                  items-center
                  justify-center
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-white/10
                  lg:px-5
                  lg:py-3.5
                  lg:text-base
                "
              >
                {item.title}
              </Link>
            </div>
          );
        })}

        {/* АКЦІЇ */}
        <Link
          href="/catalog/sale"
          className="
            my-3
            mr-3
            ml-3
            flex
            shrink-0
            items-center
            justify-center
            rounded-md
            bg-[#B49426]
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            transition-colors
            hover:bg-red-600
            lg:mr-0
            lg:px-5
            lg:py-3
            lg:text-base
          "
        >
          Акції
        </Link>
      </div>

      {/* MEGA MENU */}
      {isMegaMenuOpen && (
        <div
          className="
            absolute
            left-0
            top-full
            z-50
            w-full
            border-t
            border-border
            bg-white
            shadow-xl
          "
        >
          <div
            className="
              mx-auto
              max-w-7xl
              px-6
              py-8
            "
          >
            <div
              className="
                grid
                grid-cols-2
                gap-x-10
                gap-y-8
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
              "
            >
              {Object.entries(catalogCategories).map(
                ([categorySlug, category]) => (
                  <div key={categorySlug}>
                    {/* ОСНОВНА КАТЕГОРІЯ */}
                    <Link
                      href={`/catalog/${categorySlug}`}
                      className="
                        mb-3
                        block
                        text-base
                        font-semibold
                        text-foreground
                        transition-colors
                        hover:text-[#66852A]
                      "
                    >
                      {category.title}
                    </Link>

                    {/* ПІДКАТЕГОРІЇ */}
                    {category.subcategories.length > 0 && (
                      <div className="space-y-1.5">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.slug}
                            href={`/catalog/${categorySlug}?subcategory=${subcategory.slug}`}
                            className="
                              block
                              text-sm
                              text-muted-foreground
                              transition-colors
                              hover:text-[#66852A]
                            "
                          >
                            {subcategory.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
