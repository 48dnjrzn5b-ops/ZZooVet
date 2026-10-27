"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";

import { useShop } from "@/components/ShopContext";

export default function AccountFavoritesPage() {
  const { favorites, removeFromFavorites, addToCart, cart } = useShop();

  return (
    <main className="min-h-[70vh] bg-[#F7F5EF] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#66852A]"
        >
          <ArrowLeft size={18} />
          До особистого кабінету
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Heart className="h-7 w-7 text-[#66852A]" />
            <h1 className="text-3xl font-bold text-[#4A3528]">Обране</h1>
          </div>

          <p className="mt-2 text-gray-600">
            Ваші улюблені товари в одному місці.
          </p>

          {favorites.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Збережено товарів: {favorites.length}
            </p>
          )}
        </div>

        {favorites.length === 0 ? (
          <section className="flex flex-col items-center rounded-2xl border border-[#E9E3D8] bg-white px-6 py-14 text-center">
            <Heart className="mb-4 h-14 w-14 text-[#C8D6AE]" />

            <h2 className="text-xl font-semibold text-[#4A3528]">
              Обране поки порожнє
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              Натискайте на сердечко біля товарів, щоб зберігати їх тут.
            </p>

            <Link
              href="/catalog"
              className="mt-6 rounded-xl bg-[#66852A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#587522]"
            >
              Перейти до каталогу
            </Link>
          </section>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {favorites.map((product) => {
              const isInCart = cart.some((item) => item.id === product.id);

              return (
                <article
                  key={product.id}
                  className="flex gap-4 rounded-2xl border border-[#E9E3D8] bg-white p-4"
                >
                  <Link
                    href={`/catalog/product/${product.id}`}
                    className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-50"
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="112px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        Немає фото
                      </div>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/catalog/product/${product.id}`}
                      className="line-clamp-2 font-medium text-[#4A3528] hover:text-[#66852A]"
                    >
                      {product.title}
                    </Link>

                    <p className="mt-2 font-bold text-[#4A3528]">
                      {product.price} грн
                    </p>

                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        disabled={isInCart}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#66852A] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#587522] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                      >
                        <ShoppingCart size={15} />
                        {isInCart ? "У кошику" : "У кошик"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromFavorites(product.id)}
                        aria-label="Видалити з обраного"
                        className="text-gray-400 transition hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
