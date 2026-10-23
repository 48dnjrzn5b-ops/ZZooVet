import CategoryCard from "./CategoryCard";

import { categories } from "@/data/categories";

export default function PopularCategories() {
  return (
    <section className="w-full">
      <div
        className="
          mx-auto
          w-full
          max-w-[1400px]
          px-4
          py-8
          sm:px-6
          lg:px-10
        "
      >
        {/* Заголовок */}
        <div className="mb-6 flex items-center justify-between">
          <h2
            className="
              font-heading
              text-2xl
              font-bold
              text-foreground
              sm:text-3xl
            "
          >
            {/* Mobile / tablet */}
            <span className="lg:hidden text-[clamp(1rem,1.5vw,1.5rem)]">
              Категорії
            </span>

            {/* Desktop */}
            <span className="hidden lg:inline text-[clamp(1rem,1.5vw,1.5rem)]">
              Категорії
            </span>
          </h2>
        </div>

        {/* DESKTOP */}
        <div
          className="
            hidden
            gap-4
            lg:grid
            lg:grid-cols-6
          "
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              image={category.image}
              href={category.href}
            />
          ))}
        </div>

        {/* MOBILE */}
        <div
          className="
            flex
            gap-4
            overflow-x-auto
            pb-2
            lg:hidden
            scrollbar-none
          "
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              image={category.image}
              href={category.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
