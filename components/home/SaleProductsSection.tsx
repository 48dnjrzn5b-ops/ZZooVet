import { getProducts } from "@/lib/supabase/products";
import SaleProductsTicker from "./SaleProductsTicker";

export default async function SaleProductsSection() {
  const products = await getProducts();

  const saleProducts = products.filter((product) => product.is_sale);

  console.log("Усі товари:", products.length);
  console.log("Акційні товари:", saleProducts.length);

  return <SaleProductsTicker products={saleProducts} />;
}
