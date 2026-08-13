import CategoryCatalogCard from "@/components/catalog/CategoryCatalogCard";
import { categories } from "@/data/categories";

export default function CatalogPage() {
  return (
    <main
      className="
        min-h-screen
        bg-background
        px-4
        py-8
        sm:px-6
        sm:py-10
        lg:px-10
        lg:py-14
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* Хлібні крихти */}
        <div
          className="
            mb-6
            text-sm
            text-muted-foreground
          "
        >
          Головна / Каталог
        </div>

        {/* Заголовок */}
        <div className="mb-10">
          <h1
            className="
              font-heading
              text-3xl
              font-bold
              text-foreground
              sm:text-4xl
              lg:text-5xl
            "
          >
            Каталог
          </h1>

          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              leading-relaxed
              text-muted-foreground
              sm:text-base
            "
          >
            Оберіть категорію товарів для вашого улюбленця. Знайдіть все
            необхідне для харчування, догляду, здоров`я та комфортного життя.
          </p>
        </div>

        {/* Заголовок категорій */}
        <h2
          className="
            mb-5
            font-heading
            text-xl
            font-bold
            sm:text-2xl
          "
        >
          Усі категорії
        </h2>

        {/* Картки */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {categories.map((category) => (
            <CategoryCatalogCard
              key={category.title}
              title={category.title}
              description={category.description}
              image={category.image}
              href={category.href}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
