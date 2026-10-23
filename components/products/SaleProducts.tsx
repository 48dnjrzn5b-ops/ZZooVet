import Link from "next/link";
import ProductCard from "./ProductCard";
import type { CatalogProduct } from "@/lib/supabase/products";

export default function SaleProducts({
  products,
}: {
  products: CatalogProduct[];
}) {
  const saleProducts = products
    .filter(
      (product) =>
        product.oldPrice !== undefined && product.oldPrice > product.price
    )
    .slice(0, 4);

  if (saleProducts.length === 0) return null;

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Акційні товари
        </h2>

        <Link
          href="/catalog/sale"
          className="text-sm font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-60 sm:text-base"
        >
          Усі акції →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4">
        {saleProducts.map((product) => (
          <div
            key={product.id}
            className="relative w-[72%] min-w-[72%] shrink-0 snap-start sm:w-auto sm:min-w-0"
          >
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
