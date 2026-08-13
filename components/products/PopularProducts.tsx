import Link from "next/link";
import ProductCard from "./ProductCard";

type Product = {
  id: string | number;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
};

type PopularProductsProps = {
  products: Product[];
};

export default function PopularProducts({ products }: PopularProductsProps) {
  // Тимчасово беремо перші 4 товари.
  // Пізніше тут backend поверне
  // саме популярні товари.
  const popularProducts = products.slice(0, 4);

  return (
    <section
      className="
        px-4
        py-10
        sm:px-6
        lg:px-10
      "
    >
      {/* Заголовок */}
      <div
        className="
          mb-6
          flex
          items-center
          justify-between
        "
      >
        <h2
          className="
            font-heading
            text-2xl
            font-bold
            text-foreground
            sm:text-3xl
          "
        >
          Популярні товари
        </h2>

        <Link
          href="/catalog"
          className="
            text-sm
            font-medium
            text-foreground
            underline
            underline-offset-4
            transition-opacity
            hover:opacity-60
            sm:text-base
          "
        >
          Усі товари →
        </Link>
      </div>

      {/* Картки */}
      <div
        className="
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-3
          lg:grid-cols-4
        "
      >
        {popularProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
            oldPrice={product.oldPrice}
          />
        ))}
      </div>
    </section>
  );
}
