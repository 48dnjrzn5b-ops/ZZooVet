import { createClient } from "@/lib/supabase/client";

export type CatalogProduct = {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: string;
  subcategory: string;
  image: string;
  image2?: string;
  image3?: string;
  price: number;
  oldPrice?: number;
  currency: string;
  availability: string;
  stock_quantity: number;
  shortDescription: string;
  description: string;
  advantages: string;
  characteristics: string;
  composition: string;
  feedingRecommendations: string;
  is_active: boolean;
  is_popular: boolean;
  is_new: boolean;
  is_sale: boolean;
  attributes: Record<string, string>;
};

function mapProduct(product: Record<string, unknown>): CatalogProduct {
  const attributes =
    product.attributes &&
    typeof product.attributes === "object" &&
    !Array.isArray(product.attributes)
      ? Object.fromEntries(
          Object.entries(product.attributes as Record<string, unknown>)
            .filter(([, value]) => value != null && value !== "")
            .map(([key, value]) => [key, String(value)])
        )
      : {};

  return {
    id: String(product.id ?? ""),
    name: String(product.name ?? ""),
    brand: String(product.brand ?? ""),
    sku: String(product.sku ?? ""),
    category: String(product.category ?? ""),
    subcategory: String(product.subcategory ?? ""),
    image: String(product.image1 || "/products/placeholder.png"),
    image2: product.image2 ? String(product.image2) : undefined,
    image3: product.image3 ? String(product.image3) : undefined,
    price: Number(product.price ?? 0),
    oldPrice: product.old_price == null ? undefined : Number(product.old_price),
    currency: String(product.currency ?? "UAH"),
    availability: String(product.availability ?? ""),
    stock_quantity: Number(product.stock_quantity ?? 0),
    shortDescription: String(product.short_description ?? ""),
    description: String(product.description ?? ""),
    advantages: String(product.advantages ?? ""),
    characteristics: String(product.characteristics ?? ""),
    composition: String(product.composition ?? ""),
    feedingRecommendations: String(product.feeding_recommendations ?? ""),
    is_active: Boolean(product.is_active),
    is_popular: Boolean(product.is_popular),
    is_new: Boolean(product.is_new),
    is_sale: Boolean(product.is_sale),
    attributes,
  };
}

const productFields =
  "id, name, brand, sku, category, subcategory, price, old_price, currency, availability, stock_quantity, image1, image2, image3, short_description, description, advantages, characteristics, composition, feeding_recommendations, is_active, is_popular, is_new, is_sale, sort_order, attributes";

export async function getProducts(): Promise<CatalogProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(productFields)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Помилка завантаження товарів:", error);
    throw new Error("Не вдалося завантажити товари.");
  }

  return (data ?? []).map((product) =>
    mapProduct(product as Record<string, unknown>)
  );
}

export async function getProductById(
  id: string
): Promise<CatalogProduct | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(productFields)
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Помилка завантаження товару:", error);
    throw new Error("Не вдалося завантажити товар.");
  }

  return data ? mapProduct(data as Record<string, unknown>) : null;
}
