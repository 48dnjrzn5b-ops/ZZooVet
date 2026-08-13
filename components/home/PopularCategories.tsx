// Імпортуємо компонент картки категорії
import CategoryCard from "./CategoryCard";
import Link from "next/link";

// Імпортуємо масив усіх категорій
import { categories } from "@/data/categories";

// Створюємо компонент блоку категорій
export default function PopularCategories() {
  // Беремо перші 3 категорії для desktop
  const popularCategories = categories.slice(0, 3);

  // Повертаємо розмітку
  return (
    <section
      // Секція займає всю ширину
      className="w-full"
    >
      <div
        // Центруємо контейнер
        // Додаємо бокові та вертикальні відступи
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
        {/* ============================== */}
        {/* Заголовок */}
        {/* ============================== */}
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
              Популярні категорії
            </span>
          </h2>

          {/* Усі категорії */}
          <Link
            href="/catalog"
            className="
      text-sm
      font-medium
      text-[#A48850]
      underline
      underline-offset-4
      transition-opacity
      hover:opacity-60
      sm:text-base
    "
          >
            Більше →
          </Link>
        </div>

        {/* ================================================= */}
        {/* DESKTOP — 3 великі категорії */}
        {/* ================================================= */}

        <div
          // На mobile приховано
          // На desktop показуємо grid із 3 колонок
          className="
            hidden
            gap-5
            lg:grid
            lg:grid-cols-3
          "
        >
          {/* Перебираємо перші 3 категорії */}
          {popularCategories.map((category) => (
            <CategoryCard
              // Унікальний key
              key={category.title}
              // Назва категорії
              title={category.title}
              // Картинка категорії
              image={category.image}
              // Посилання категорії
              href={category.href}
            />
          ))}
        </div>

        {/* ================================================= */}
        {/* MOBILE — всі категорії горизонтально */}
        {/* ================================================= */}

        <div
          // На mobile показуємо flex
          // Категорії стоять в один ряд
          // overflow-x-auto дозволяє свайпати вправо
          // На desktop блок прихований
          className="
            flex
            gap-4
            overflow-x-auto
            pb-2
            lg:hidden
            scrollbar-none
          "
        >
          {/* Перебираємо всі 8 категорій */}
          {categories.map((category) => (
            <CategoryCard
              // Унікальний key
              key={category.title}
              // Назва категорії
              title={category.title}
              // Картинка категорії
              image={category.image}
              // Посилання категорії
              href={category.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
