import Link from "next/link";
import ProductCard from "./ProductCard";

type Product = {
  id: string | number;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
};

type NewProductsProps = {
  products: Product[];
};

export default function NewProducts({ products }: NewProductsProps) {
  // Сортуємо товари від найновішого
  // до найстарішого.
  const newProducts = [...products]
    .sort((a, b) => {
      return Number(b.id) - Number(a.id);
    })
    .slice(0, 4);

  return (
    <section
      className="
        px-4
        py-10
        sm:px-6
        lg:px-10
      "
    >
      {/* Заголовок секції */}
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
          Новинки
        </h2>

        <Link
          href="/catalog/new"
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
          Усі новинки →
        </Link>
      </div>

      {/* Сітка товарів */}
      <div
        className="
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-3
          lg:grid-cols-4
        "
      >
        {newProducts.map((product) => (
          <div key={product.id} className="relative">
            {/* Бейдж новинки */}
            <span
              className="
                absolute
                left-4
                top-4
                z-20
                rounded-full
                bg-[#D6B36A]
                px-3
                py-1
                text-xs
                font-bold
                text-white
              "
            >
              Новинка
            </span>

            <ProductCard
              id={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              oldPrice={product.oldPrice}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
