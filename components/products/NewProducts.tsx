import Link from "next/link";
import ProductCard from "./ProductCard";
import type { CatalogProduct } from "@/lib/supabase/products";

export default function NewProducts({
  products,
}: {
  products: CatalogProduct[];
}) {
  const newProducts = products.filter((product) => product.is_new).slice(0, 4);

  if (newProducts.length === 0) return null;

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Новинки
        </h2>

        <Link
          href="/catalog/new"
          className="text-sm font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-60 sm:text-base"
        >
          Усі новинки →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4">
        {newProducts.map((product) => (
          <div
            key={product.id}
            className="relative w-[72%] min-w-[72%] shrink-0 snap-start sm:w-auto sm:min-w-0"
          >
            <span className="absolute left-4 top-4 z-20 rounded-full bg-[#D6B36A] px-3 py-1 text-xs font-bold text-white">
              Новинка
            </span>

            <ProductCard
              id={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              oldPrice={product.oldPrice}
              stock_quantity={product.stock_quantity}
              availability={product.availability}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
