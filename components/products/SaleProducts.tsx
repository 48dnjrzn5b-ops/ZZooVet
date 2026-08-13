import Link from "next/link";
// Імпортуємо універсальну картку товару
import ProductCard from "./ProductCard";

// Описуємо структуру товару,
// яку пізніше будемо отримувати з backend
type Product = {
  id: string | number;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
};

// Описуємо props блоку
type SaleProductsProps = {
  // Масив усіх товарів
  products: Product[];
};

// Створюємо секцію акційних товарів
export default function SaleProducts({ products }: SaleProductsProps) {
  // Беремо всі товари
  // і залишаємо тільки ті,
  // де стара ціна більша за нову.
  const saleProducts = products.filter(
    (product) =>
      product.oldPrice !== undefined && product.oldPrice > product.price
  );

  return (
    <section
      className="
        px-4
        py-6
        sm:px-6
        lg:px-16
      "
    >
      {/* ========================= */}
      {/* ЗАГОЛОВОК */}
      {/* ========================= */}

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
          Акційні товари
        </h2>

        <Link
          href="/catalog/sale"
          className="
            text-sm
            font-medium
            text-foreground
            underline
            underline-offset-4
            hover:opacity-60
            sm:text-base
          "
        >
          Усі акції →
        </Link>
      </div>

      {/* ========================= */}
      {/* КАРТКИ */}
      {/* ========================= */}

      <div
        className="
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-3
          lg:grid-cols-4
        "
      >
        {saleProducts.map((product) => (
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
