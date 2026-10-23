"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, type CatalogProduct } from "@/lib/supabase/products";

export default function SalePage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const data = await getProducts();

        if (!cancelled) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Помилка завантаження акційних товарів:", error);

        if (!cancelled) {
          setLoadError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const saleProducts = products.filter(
    (product) =>
      product.oldPrice !== undefined && product.oldPrice > product.price
  );

  return (
    <main className="min-h-screen bg-background">
      {" "}
      <section
        className="
       mx-auto
       w-full
       max-w-[1400px]
       px-4
       py-10
       sm:px-6
       lg:px-10
     "
      >
        {/* Заголовок */}{" "}
        <div className="mb-8">
          {" "}
          <p className="text-sm font-medium uppercase tracking-wide text-[#66852A]">
            ЗООVet Світ{" "}
          </p>
          <h1
            className="
          mt-2
          font-heading
          text-3xl
          font-bold
          text-foreground
          sm:text-4xl
        "
          >
            Акційні товари
          </h1>
          <p className="mt-3 max-w-2xl text-gray-500">
            Вигідні пропозиції для ваших улюбленців.
          </p>
        </div>
        {/* Стани завантаження */}
        {isLoading ? (
          <div className="py-16 text-center text-gray-500">
            Завантаження акційних товарів...
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-border bg-muted/30 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              Не вдалося завантажити товари
            </h2>

            <p className="mt-2 text-gray-500">
              Перевір підключення до бази даних і спробуй ще раз.
            </p>
          </div>
        ) : saleProducts.length > 0 ? (
          <div
            className="
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
        "
          >
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-muted/30 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              Зараз немає акційних товарів
            </h2>

            <p className="mt-2 text-gray-500">
              Слідкуйте за оновленнями — скоро можуть зʼявитися нові акції.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
