"use client";

import { useEffect, useState } from "react";
import { getProducts, type CatalogProduct } from "@/lib/supabase/products";

import SaleProducts from "@/components/products/SaleProducts";
import NewProducts from "@/components/products/NewProducts";
import PopularProducts from "@/components/products/PopularProducts";

export default function HomeProductSections() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const data = await getProducts();

        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Не вдалося завантажити товари:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <SaleProducts products={products} />
      <NewProducts products={products} />
      <PopularProducts products={products} />
    </>
  );
}
