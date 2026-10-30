import Hero from "@/components/home/Hero";
import SaleProductsSection from "@/components/home/SaleProductsSection";
import PopularCategories from "@/components/home/PopularCategories";
import HomeProductSections from "@/components/home/HomeProductSections";
import Advantages from "@/components/home/Advantages";

export default function Home() {
  return (
    <main>
      <SaleProductsSection />

      <Hero />

      <Advantages />

      <PopularCategories />

      <HomeProductSections />
    </main>
  );
}
