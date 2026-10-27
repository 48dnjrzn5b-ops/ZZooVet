import CategoryCatalogCard from "@/components/catalog/CategoryCatalogCard";
import CatalogSearchResults from "@/components/catalog/CatalogSearchResults";
import { categories } from "@/data/categories";

type CatalogPageProps = {
  searchParams: Promise<{
    search?: string | string[];
  }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const searchValue = Array.isArray(params.search)
    ? params.search[0]
    : params.search;
  const searchQuery = searchValue?.trim() ?? "";

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
        <div className="mb-6 text-sm text-muted-foreground">
          Головна / Каталог
        </div>

        {searchQuery ? (
          <>
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                Результати пошуку
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Результати за запитом: «{searchQuery}»
              </p>
            </div>

            <CatalogSearchResults searchQuery={searchQuery} />
          </>
        ) : (
          <>
            <div className="mb-10">
              <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                Каталог
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Оберіть категорію товарів для вашого улюбленця. Знайдіть все
                необхідне для харчування, догляду, здоров’я та комфортного
                життя.
              </p>
            </div>

            <h2 className="mb-5 font-heading text-xl font-bold sm:text-2xl">
              Усі категорії
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          </>
        )}
      </div>
    </main>
  );
}
