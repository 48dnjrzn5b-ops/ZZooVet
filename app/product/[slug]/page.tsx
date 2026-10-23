"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductActions from "@/components/ProductActions";
import { getProductById, type CatalogProduct } from "@/lib/supabase/products";
import {
  CreditCard,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  PackageCheck,
} from "lucide-react";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const attributeLabels: Record<string, string> = {
  animal: "Вид тварини",
  animalType: "Вид тварини",
  animal_type: "Вид тварини",
  "Вид тварини": "Вид тварини",
  age: "Вік тварини",
  animalAge: "Вік тварини",
  animalSize: "Розмір тварини",
  animalWeight: "Вага тварини",
  breed: "Порода",
  sex: "Стать",
  material: "Матеріал",
  color: "Колір",
  packagingType: "Тип упаковки",
  weight: "Вага / Об'єм",
  size: "Розмір",
};

function getAttributeLabel(key: string) {
  return (
    attributeLabels[key] ??
    attributeLabels[key.toLowerCase()] ??
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (letter) => letter.toUpperCase())
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3 rounded-2xl border border-gray-100 bg-[#FAFAF7] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#66852A]">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-gray-500">{children}</p>
        </div>
      </div>
    </div>
  );
}

function DetailText({
  title,
  value,
}: {
  title: string;
  value?: string | null;
}) {
  if (!value?.trim()) return null;

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-3 whitespace-pre-line leading-8 text-gray-600">
        {value}
      </p>
    </section>
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);

  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setIsLoading(true);
      setLoadError(false);
      setProduct(null);

      try {
        const result = await getProductById(slug);

        if (cancelled) return;

        setProduct(result);
        setSelectedImage(result?.image ?? "");
      } catch (error) {
        console.error("Помилка завантаження сторінки товару:", error);

        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-20">
        <p className="text-center text-gray-500">Завантаження товару...</p>
      </main>
    );
  }

  if (loadError || !product) {
    return (
      <main className="min-h-screen px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            {loadError ? "Не вдалося завантажити товар" : "Товар не знайдено"}
          </h1>

          <p className="mt-3 text-gray-500">
            {loadError
              ? "Перевір підключення до бази даних і спробуй ще раз."
              : "Можливо, товар неактивний або посилання неправильне."}
          </p>

          <Link
            href="/catalog"
            className="mt-6 inline-flex rounded-xl bg-[#66852A] px-6 py-3 font-medium text-white transition hover:bg-[#587522]"
          >
            Повернутися до каталогу
          </Link>
        </div>
      </main>
    );
  }

  const images = [product.image, product.image2, product.image3].filter(
    (image): image is string => Boolean(image?.trim())
  );

  const attributes = Object.entries(product.attributes ?? {}).filter(
    ([, value]) => Boolean(value?.trim())
  );

  const currency =
    product.currency.toUpperCase() === "UAH" ? "грн" : product.currency;

  const isAvailable =
    product.stock_quantity > 0 &&
    product.availability.toLowerCase() !== "немає в наявності";

  const showOldPrice =
    product.oldPrice !== undefined && product.oldPrice > product.price;

  return (
    <main className="bg-white">
      {/* ХЛІБНІ КРИХТИ */}
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-[#66852A]">
            Головна
          </Link>
          <span>/</span>
          <Link href="/catalog" className="transition hover:text-[#66852A]">
            Каталог
          </Link>
          <span>/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>
      </div>

      {/* ОСНОВНА ІНФОРМАЦІЯ */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* ФОТО ТОВАРУ */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#F7F7F3]">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  Немає фото
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    aria-label={`Фото ${index + 1}`}
                    className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 bg-[#F7F7F3] ${
                      selectedImage === image
                        ? "border-[#66852A]"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} — фото ${index + 1}`}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ІНФОРМАЦІЯ */}
          <div className="flex flex-col">
            {product.brand && (
              <p className="text-sm font-medium uppercase tracking-wide text-[#66852A]">
                {product.brand}
              </p>
            )}

            <h1 className="mt-2 text-3xl font-semibold leading-tight text-gray-900 md:text-4xl">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="mt-4 whitespace-pre-line text-base leading-7 text-gray-600">
                {product.shortDescription}
              </p>
            )}

            {(product.category || product.subcategory) && (
              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                {product.category && <span>{product.category}</span>}

                {product.category && product.subcategory && (
                  <span className="text-gray-300">•</span>
                )}

                {product.subcategory && <span>{product.subcategory}</span>}
              </div>
            )}

            {product.sku && (
              <p className="mt-3 text-sm text-gray-500">
                Артикул: {product.sku}
              </p>
            )}

            {/* ЦІНА */}
            <div className="mt-8 flex flex-wrap items-end gap-4">
              <span
                className={`text-3xl font-bold ${
                  isAvailable ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {product.price} {currency}
              </span>

              {showOldPrice && (
                <span className="pb-1 text-lg text-gray-400 line-through">
                  {product.oldPrice} {currency}
                </span>
              )}
            </div>

            {/* НАЯВНІСТЬ */}
            <p
              className={`mt-3 text-sm font-medium ${
                isAvailable ? "text-[#66852A]" : "text-red-500"
              }`}
            >
              {isAvailable
                ? product.availability || "Є в наявності"
                : "Немає в наявності"}
            </p>

            {product.stock_quantity > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                Залишилося: {product.stock_quantity} шт.
              </p>
            )}

            {/* ОПЛАТА */}
            <div className="mt-6 rounded-2xl border border-gray-100 bg-[#FAFAF7] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#66852A]">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Способи оплати</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Visa або Mastercard онлайн, післяплата при отриманні або
                    оплата в магазині.
                  </p>
                </div>
              </div>
            </div>

            <InfoCard icon={<Truck size={20} />} title="Способи доставки">
              Нова Пошта, курʼєрська доставка або самовивіз з магазину.
            </InfoCard>

            <InfoCard icon={<ShieldCheck size={20} />} title="Безпечна покупка">
              Перевіряємо товар перед відправленням та дбайливо пакуємо кожне
              замовлення.
            </InfoCard>

            {/* КОШИК */}
            {isAvailable && (
              <ProductActions
                product={{
                  id: product.id,
                  title: product.name,
                  image: product.image,
                  price: product.price,
                  oldPrice: product.oldPrice,
                }}
              />
            )}
          </div>
        </div>
      </section>

      {/* ОПИС І ХАРАКТЕРИСТИКИ */}
      <section className="border-t border-gray-100 bg-[#FAFAF7]">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-2xl font-semibold text-gray-900">
            Інформація про товар
          </h2>

          <DetailText title="Короткий опис" value={product.shortDescription} />
          <DetailText title="Опис товару" value={product.description} />
          <DetailText title="Переваги" value={product.advantages} />
          <DetailText title="Характеристики" value={product.characteristics} />
          <DetailText title="Склад" value={product.composition} />
          <DetailText
            title="Рекомендації щодо годування"
            value={product.feedingRecommendations}
          />

          {/* ОСНОВНІ ХАРАКТЕРИСТИКИ */}
          {(product.brand ||
            product.sku ||
            product.category ||
            product.subcategory ||
            attributes.length > 0) && (
            <div className="mt-14">
              <h2 className="text-2xl font-semibold text-gray-900">
                Характеристики товару
              </h2>

              <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {[
                  ["Бренд", product.brand],
                  ["Артикул", product.sku],
                  ["Категорія", product.category],
                  ["Підкатегорія", product.subcategory],
                ]
                  .filter(([, value]) => Boolean(value?.trim()))
                  .map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-1 gap-2 border-b border-gray-100 px-5 py-4 last:border-b-0 sm:grid-cols-2"
                    >
                      <span className="font-medium text-gray-700">{label}</span>
                      <span className="whitespace-pre-line text-gray-600">
                        {value}
                      </span>
                    </div>
                  ))}

                {attributes.map(([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-1 gap-2 border-t border-gray-100 px-5 py-4 sm:grid-cols-2"
                  >
                    <span className="font-medium text-gray-700">
                      {getAttributeLabel(key)}
                    </span>
                    <span className="whitespace-pre-line text-gray-600">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ПЕРЕВАГИ МАГАЗИНУ */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-[#66852A]">
              ЗООVet Світ
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-gray-900">
              Турбота про вашого улюбленця
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-[#FAFAF7] p-6">
              <Truck className="text-[#66852A]" size={26} />
              <h3 className="mt-5 font-semibold text-gray-900">
                Швидка доставка
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Відправляємо замовлення зручним для вас способом.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-[#FAFAF7] p-6">
              <RotateCcw className="text-[#66852A]" size={26} />
              <h3 className="mt-5 font-semibold text-gray-900">
                Зручне повернення
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Повернення товару протягом 14 днів відповідно до умов магазину.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-[#FAFAF7] p-6">
              <MessageCircle className="text-[#66852A]" size={26} />
              <h3 className="mt-5 font-semibold text-gray-900">
                Допомога у виборі
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Допоможемо підібрати товари для вашого улюбленця.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-[#FAFAF7] p-6">
              <PackageCheck className="text-[#66852A]" size={26} />
              <h3 className="mt-5 font-semibold text-gray-900">
                Дбайливе пакування
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Перевіряємо замовлення перед відправленням.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#66852A]">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Потрібна допомога з вибором?
          </h2>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-white/80">
            Якщо ви не знаєте, який товар підійде саме вашому улюбленцю — ми
            допоможемо.
          </p>
          <Link
            href="/contacts"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 font-medium text-[#66852A] transition hover:bg-gray-100"
          >
            Звʼязатися з нами
          </Link>
        </div>
      </section>
    </main>
  );
}
