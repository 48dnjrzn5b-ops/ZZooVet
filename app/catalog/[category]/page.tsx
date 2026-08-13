import CatalogSidebar from "@/components/catalog/CatalogSidebar";
import { categories } from "@/data/categories";
import ProductCard from "@/components/products/ProductCard";

const products = [
  {
    id: 1,
    name: "Сухий корм для собак",
    image: "/products/dog-food.png",
    price: 400,
  },
  {
    id: 2,
    name: "Ласощі для собак",
    image: "/products/treats.png",
    price: 250,
    oldPrice: 300,
  },
  {
    id: 3,
    name: "М'ячик для собак",
    image: "/products/ball.png",
    price: 180,
  },
  {
    id: 4,
    name: "Корм преміум для собак",
    image: "/products/dog-food.png",
    price: 520,
    oldPrice: 650,
  },
];

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Отримуємо slug категорії з URL
  const { category } = await params;

  // Знаходимо потрібну категорію
  const currentCategory = categories.find(
    (item) => item.href === `/catalog/${category}`
  );

  // Якщо такої категорії немає
  if (!currentCategory) {
    return (
      <main className="px-6 py-10">
        <h1 className="text-2xl font-bold">Категорію не знайдено</h1>
      </main>
    );
  }

  return (
    <main
      className="
        min-h-screen
        px-4
        py-8
        sm:px-6
        lg:px-10
        lg:py-12
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* Назва поточної категорії */}
        <h1
          className="
            mb-8
            font-heading
            text-3xl
            font-bold
            sm:text-4xl
          "
        >
          {currentCategory.title}
        </h1>

        <div
          className="    flex
    items-start
    gap-10"
        >
          {/* SIDEBAR */}
          <CatalogSidebar currentCategory={category} />

          {/* PRODUCTS */}
          <section className="min-w-0 flex-1">
            <div
              className="
                mb-6
                flex
                items-center
                justify-between
              "
            >
              <p className="text-muted-foreground">Товари категорії</p>

              <button>Сортувати ↓</button>
            </div>
            <div
              className="
    grid
    grid-cols-2
    gap-4
    sm:grid-cols-2
    xl:grid-cols-3
  "
            >
              {products.map((product) => (
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
            {/* Тут пізніше будуть картки товарів */}
          </section>
        </div>
      </div>
    </main>
  );
}
