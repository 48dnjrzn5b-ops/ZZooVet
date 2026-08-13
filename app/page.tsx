import Hero from "@/components/home/Hero";
import PopularCategories from "@/components/home/PopularCategories";
import SaleProducts from "@/components/products/SaleProducts";
import NewProducts from "@/components/products/NewProducts";
import PopularProducts from "@/components/products/PopularProducts";
import Advantages from "@/components/home/Advantages";

const products = [
  {
    id: 1,
    name: "Сухий корм для собак",
    image: "/products/dog-food.png",
    price: 400,
    oldPrice: 500,
  },
  {
    id: 2,
    name: "Корм для котів",
    image: "/products/cat-food.png",
    price: 350,
    oldPrice: 420,
  },
  {
    id: 3,
    name: "Ласощі для собак",
    image: "/products/treats.png",
    price: 200,
    oldPrice: 250,
  },
  {
    id: 4,
    name: "М'ячик для собак",
    image: "/products/ball.png",
    price: 180,
  },
  {
    id: 5,
    name: "М'ячик для собак",
    image: "/products/ball.png",
    price: 180,
    oldPrice: 250,
  },
];

export default function Home() {
  return (
    <main>
      <Hero />

      <Advantages />

      <PopularCategories />

      <SaleProducts products={products} />

      <NewProducts products={products} />

      <PopularProducts products={products} />
    </main>
  );
}
