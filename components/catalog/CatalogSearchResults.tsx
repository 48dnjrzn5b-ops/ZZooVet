"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, type CatalogProduct } from "@/lib/supabase/products";

type CatalogSearchResultsProps = {
  searchQuery: string;
};

type SearchableProduct = CatalogProduct & {
  sku?: string | null;
  description?: string | null;
  short_description?: string | null;
  composition?: string | null;
  characteristics?: string | null;
};

export default function CatalogSearchResults({
  searchQuery,
}: CatalogSearchResultsProps) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const data = await getProducts();

        if (active) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Не вдалося завантажити товари для пошуку:", error);
        if (active) setLoadError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const words = searchQuery
      .toLocaleLowerCase("uk-UA")
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) return [];

    return products.filter((product) => {
      const searchableProduct = product as SearchableProduct;
      const searchableText = [
        searchableProduct.name,
        searchableProduct.brand,
        searchableProduct.sku,
        searchableProduct.category,
        searchableProduct.subcategory,
        searchableProduct.shortDescription,
        searchableProduct.short_description,
        searchableProduct.description,
        searchableProduct.composition,
        searchableProduct.characteristics,
        ...Object.values(searchableProduct.attributes ?? {}),
      ]
        .filter((value): value is string => typeof value === "string")
        .join(" ")
        .toLocaleLowerCase("uk-UA");

      return words.every((word) => searchableText.includes(word));
    });
  }, [products, searchQuery]);

  if (isLoading) {
    return (
      <p className="py-10 text-center text-muted-foreground">
        Завантажуємо товари для пошуку...
      </p>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center">
        <h2 className="mb-2 text-xl font-semibold">
          Не вдалося завантажити товари
        </h2>
        <p className="text-muted-foreground">
          Перевірте з’єднання та спробуйте оновити сторінку.
        </p>
      </div>
    );
  }

  return (
    <section>
      <p className="mb-6 text-muted-foreground">
        Знайдено товарів:{" "}
        <span className="font-semibold text-foreground">
          {filteredProducts.length}
        </span>
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center">
          <h2 className="mb-2 text-xl font-semibold">Товарів не знайдено</h2>
          <p className="mb-5 text-muted-foreground">
            Спробуйте змінити назву, бренд або артикул товару.
          </p>
          <Link
            href="/catalog"
            className="inline-flex rounded-xl bg-[#66852A] px-5 py-2.5 font-semibold text-white transition hover:bg-[#587522]"
          >
            Повернутися до каталогу
          </Link>
        </div>
      )}
    </section>
  );
}
