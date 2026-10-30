"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Flame, ShoppingCart } from "lucide-react";
import { useShop, type Product } from "@/components/ShopContext";
import type { CatalogProduct } from "@/lib/supabase/products";

type Props = {
  products: CatalogProduct[];
};

export default function SaleProductsTicker({ products }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { cart, addToCart } = useShop();

  const dotCount = Math.min(products.length, 4);

  const scrollNext = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>("[data-sale-card]");
    if (!card) return;

    const step = card.offsetWidth + 12;
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (maxScroll <= 5) return;

    track.scrollTo({
      left:
        track.scrollLeft >= maxScroll - 10
          ? 0
          : Math.min(track.scrollLeft + step, maxScroll),
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (products.length <= 1) return;

    const timer = window.setInterval(scrollNext, 5000);

    return () => window.clearInterval(timer);
  }, [products.length, scrollNext]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;

    if (maxScroll <= 0 || dotCount <= 1) return;

    const index = Math.round((track.scrollLeft / maxScroll) * (dotCount - 1));

    setActiveIndex(index);
  };

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track || dotCount <= 1) return;

    const maxScroll = track.scrollWidth - track.clientWidth;

    track.scrollTo({
      left: (index / (dotCount - 1)) * maxScroll,
      behavior: "smooth",
    });
  };

  if (!products.length) return null;

  return (
    <section className="w-full bg-[#F8F7F2] px-4 py-1 sm:px-6">
      <div
        className="
          relative mx-auto flex h-[220px] w-full
          max-w-[1900px] items-stretch gap-3
          overflow-hidden rounded-[22px]
          bg-[#EDF1E5] p-3
          sm:h-[230px] sm:gap-4 sm:p-3
        "
      >
        {/* ІНФОРМАЦІЯ ПРО АКЦІЇ */}
        <div
          className="
            flex w-[27%] min-w-[105px] max-w-[200px]
            shrink-0 flex-col justify-between py-1
          "
        >
          <div>
            <Flame size={23} className="mb-2 fill-[#355C38] text-[#355C38]" />

            <h2
              className="
                text-[16px] font-extrabold
                leading-tight text-[#243C31]
                sm:text-xl
              "
            >
              Акційні товари
            </h2>

            <p
              className="
                mt-2 max-w-[180px] text-[10px]
                leading-snug text-[#343C32]
                sm:text-xs
              "
            >
              Найкращі пропозиції для ваших улюбленців
            </p>
          </div>

          <Link
            href="/catalog/sale"
            aria-label="Усі акційні товари"
            className="
              flex h-8 w-8 items-center justify-center
              rounded-full bg-[#66852A] text-white
              transition hover:scale-105
            "
          >
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* СТРІЧКА ТОВАРІВ */}
        <div className="relative min-w-0 flex-1 pb-7">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="
              flex h-full items-stretch gap-3
              overflow-x-auto snap-x snap-mandatory
              scroll-smooth scrollbar-hide
              overscroll-x-contain
            "
          >
            {products.map((product) => {
              const oldPrice = product.oldPrice ?? 0;
              const hasDiscount = oldPrice > 0 && oldPrice > product.price;

              const discount = hasDiscount
                ? Math.round(((oldPrice - product.price) / oldPrice) * 100)
                : 0;

              const formattedProduct: Product = {
                id: product.id,
                title: product.name,
                price: product.price,
                image: product.image,
                oldPrice: product.oldPrice,
              };

              const isInCart = cart.some((item) => item.id === product.id);

              const isAvailable =
                product.stock_quantity > 0 &&
                (product.availability ?? "").toLowerCase() !==
                  "немає в наявності";

              return (
                <article
                  key={product.id}
                  data-sale-card
                  className="
                    relative flex w-[155px] shrink-0
                    snap-start flex-col rounded-[17px]
                    bg-white p-3
                    sm:w-[175px] sm:p-3
                  "
                >
                  {/* ЗНИЖКА */}
                  {hasDiscount && (
                    <span
                      className="
                        absolute left-2 top-2 z-10
                        rounded-full bg-[#E94D58]
                        px-2 py-0.5 text-[10px]
                        font-bold text-white
                      "
                    >
                      -{discount}%
                    </span>
                  )}

                  {/* ФОТО */}
                  <Link
                    href={`/product/${product.id}`}
                    className="
                      relative mb-2 h-[105px] w-full
                      overflow-hidden rounded-xl bg-white
                      sm:h-[115px]
                    "
                  >
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="175px"
                        className="object-contain p-1"
                      />
                    )}
                  </Link>

                  {/* НАЗВА */}
                  <Link
                    href={`/product/${product.id}`}
                    className="
                      line-clamp-2 min-h-[34px]
                      text-xs font-medium
                      leading-[1.3] text-[#302C25]
                      hover:text-[#66852A]
                      sm:text-sm
                    "
                  >
                    {product.name}
                  </Link>

                  {/* ЦІНА ТА КОШИК */}
                  <div
                    className="
                      mt-auto flex items-end
                      justify-between gap-1 pt-1
                    "
                  >
                    <div className="flex min-w-0 flex-col">
                      {hasDiscount && (
                        <span
                          className="
                            text-[10px] text-[#99958B]
                            line-through
                          "
                        >
                          {oldPrice} грн
                        </span>
                      )}

                      <span
                        className="
                          whitespace-nowrap text-xs
                          font-bold text-[#526F35]
                          sm:text-sm
                        "
                      >
                        {product.price} грн
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={!isAvailable}
                      aria-label={
                        !isAvailable
                          ? "Немає в наявності"
                          : `Додати ${product.name} у кошик`
                      }
                      onClick={() => addToCart(formattedProduct)}
                      className="
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-full bg-[#66852A]
                        text-white transition
                        hover:bg-[#526F35]
                        active:scale-90
                        disabled:cursor-not-allowed
                        disabled:bg-gray-300
                      "
                    >
                      <ShoppingCart size={15} />
                    </button>
                  </div>

                  {isInCart && (
                    <span
                      className="
                        mt-0.5 text-center text-[9px]
                        font-semibold text-[#66852A]
                      "
                    >
                      Уже в кошику
                    </span>
                  )}
                </article>
              );
            })}
          </div>

          {/* ІНДИКАТОРИ */}
          <div
            className="
              absolute bottom-0 left-0 right-0
              flex items-center justify-center
            "
          >
            <div className="flex items-center gap-2">
              {Array.from({ length: dotCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Позиція ${i + 1}`}
                  onClick={() => scrollToIndex(i)}
                  className={`
                    h-2 w-2 rounded-full transition-colors
                    ${activeIndex === i ? "bg-[#66852A]" : "bg-[#D5DCCB]"}
                  `}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Наступні товари"
              className="
                absolute right-0 flex h-7 w-7
                items-center justify-center
                rounded-full bg-white text-[#66852A]
                transition hover:scale-105
              "
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
