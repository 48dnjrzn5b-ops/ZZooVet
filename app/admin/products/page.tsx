"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Upload, Package } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
  brand: string | null;
  sku: string | null;
  category: string;
  price: number;
  stock_quantity: number | null;
  availability: string | null;
  is_active: boolean | null;
};

const categoryLabels: Record<string, string> = {
  dogs: "Собакам",
  cats: "Котам",
  rodents: "Гризунам",
  birds: "Птахам",
  fish: "Рибам",
};

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  async function handleDeleteProduct(product: Product) {
    const confirmed = window.confirm(`Видалити товар «${product.name}»?`);

    if (!confirmed) return;

    const supabase = createClient();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      alert(`Не вдалося видалити товар: ${error.message}`);
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((item) => item.id !== product.id)
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, brand, sku, category, price, stock_quantity, availability, is_active"
        )
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        setErrorMessage(error.message);
      } else {
        setProducts((data ?? []) as Product[]);
      }

      setLoading(false);
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        (product.brand ?? "").toLowerCase().includes(normalizedSearch) ||
        (product.sku ?? "").toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const isAvailable =
        product.stock_quantity !== null && product.stock_quantity > 0;

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && isAvailable) ||
        (availabilityFilter === "unavailable" && !isAvailable);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, search, categoryFilter, availabilityFilter]);

  return (
    <div className="min-h-screen bg-[#F7F7F2] p-5 md:p-8">
      <div className="mx-auto min-w-0 max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#4A3528]">Товари</h1>
            <p className="mt-2 text-sm text-gray-500">
              Керування товарами магазину
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled
              title="Імпорт Excel додамо окремим кроком"
              className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-400"
            >
              <Upload size={18} />
              Імпорт Excel
            </button>

            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 rounded-xl bg-[#66852A] px-4 py-3 font-medium text-white transition hover:bg-[#587522]"
            >
              <Plus size={18} />
              Додати товар
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-4 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Назва, бренд або артикул..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-[#66852A]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
          >
            <option value="all">Усі категорії</option>
            <option value="dogs">Собакам</option>
            <option value="cats">Котам</option>
            <option value="rodents">Гризунам</option>
            <option value="birds">Птахам</option>
            <option value="fish">Рибам</option>
          </select>

          <select
            value={availabilityFilter}
            onChange={(event) => setAvailabilityFilter(event.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#66852A]"
          >
            <option value="all">Уся наявність</option>
            <option value="available">Є в наявності</option>
            <option value="unavailable">Немає в наявності</option>
          </select>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">Не вдалося завантажити товари</p>
            <p className="mt-1">{errorMessage}</p>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <Package className="text-[#66852A]" size={22} />
              <h2 className="font-semibold text-[#4A3528]">Список товарів</h2>
            </div>

            {!loading && (
              <span className="text-sm text-gray-500">
                Знайдено: {filteredProducts.length}
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Завантажуємо товари...
            </div>
          ) : !errorMessage && filteredProducts.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              {products.length === 0
                ? "У базі даних поки немає товарів."
                : "За вашим запитом товарів не знайдено."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Товар</th>
                    <th className="px-5 py-4 font-medium">Категорія</th>
                    <th className="px-5 py-4 font-medium">Ціна</th>
                    <th className="px-5 py-4 font-medium">Залишок</th>
                    <th className="px-5 py-4 font-medium">Статус</th>
                    <th className="px-5 py-4 text-right font-medium">Дії</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const inStock =
                      product.stock_quantity !== null &&
                      product.stock_quantity > 0;

                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#4A3528]">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {product.brand || "Без бренду"}
                            {product.sku ? ` · ${product.sku}` : ""}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {categoryLabels[product.category] ?? product.category}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-medium">
                          {Number(product.price).toLocaleString("uk-UA")} ₴
                        </td>

                        <td className="px-5 py-4">
                          {product.stock_quantity ?? 0}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              product.is_active === false
                                ? "bg-gray-100 text-gray-600"
                                : inStock
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {product.is_active === false
                              ? "Неактивний"
                              : inStock
                              ? "В наявності"
                              : "Немає в наявності"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/admin/products/${product.id}/edit`
                                )
                              }
                              title="Редагувати товар"
                              className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product)}
                              title="Видалити товар"
                              className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
