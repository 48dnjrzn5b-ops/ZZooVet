import Link from "next/link";
import Image from "next/image";

const catalogLinks = [
  { label: "Собакам", href: "/catalog/dogs" },
  { label: "Котам", href: "/catalog/cats" },
  { label: "Гризунам", href: "/catalog/rodents" },
  { label: "Птахам", href: "/catalog/birds" },
  { label: "Рибкам", href: "/catalog/fish" },
  { label: "Усі категорії", href: "/catalog" },
];

const shopLinks = [
  { label: "Популярні товари", href: "/popular" },
  { label: "Новинки", href: "/new" },
  { label: "Акції", href: "/sale" },
  { label: "Про нас", href: "/about" },
];

const informationLinks = [
  { label: "Доставка та оплата", href: "/delivery" },
  { label: "Контакти", href: "/contacts" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#2F2A23] px-4 py-10 text-white sm:px-6 sm:py-12 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Основна частина */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
          {/* Логотип та опис */}
          <div>
            <Link
              href="/"
              aria-label="ЗООVet Світ — на головну"
              className="inline-flex items-center gap-3"
            >
              <Image
                src="/logo.svg"
                alt="ЗООVet Світ"
                width={64}
                height={64}
                className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
              />

              <span className="font-heading text-xl font-bold sm:text-2xl">
                ЗООVet <span className="text-[#A8C66C]">Світ</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-white/70">
              Усе необхідне для здоров’я, догляду та щасливого життя ваших
              улюбленців.
            </p>

            <Link
              href="/catalog"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#66852A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#587522]"
            >
              Перейти до каталогу
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Каталог */}
          <div>
            <h2 className="font-heading text-base font-bold">Каталог</h2>

            <nav
              aria-label="Категорії товарів"
              className="mt-5 flex flex-col items-start gap-3 text-sm text-white/70"
            >
              {catalogLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-[#A8C66C]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Покупцям */}
          <div>
            <h2 className="font-heading text-base font-bold">Покупцям</h2>

            <nav
              aria-label="Розділи магазину"
              className="mt-5 flex flex-col items-start gap-3 text-sm text-white/70"
            >
              {shopLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-[#A8C66C]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Інформація та контакти */}
          <div>
            <h2 className="font-heading text-base font-bold">
              Допомога та контакти
            </h2>

            <nav
              aria-label="Інформація для покупців"
              className="mt-5 flex flex-col items-start gap-3 text-sm text-white/70"
            >
              {informationLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-[#A8C66C]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">
              Маєте запитання? Перейдіть на сторінку контактів — ми допоможемо
              зорієнтуватися.
            </p>

            <Link
              href="/contacts"
              className="mt-3 inline-block text-sm font-semibold text-[#A8C66C] transition-colors hover:text-white"
            >
              Зв’язатися з нами →
            </Link>
          </div>
        </div>

        {/* Нижня частина */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs leading-5 text-white/50 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>© {new Date().getFullYear()} ЗООVet Світ. Усі права захищені.</p>

          <Link href="/" className="transition-colors hover:text-white">
            З турботою про ваших улюбленців 🐾
          </Link>
        </div>
      </div>
    </footer>
  );
}
