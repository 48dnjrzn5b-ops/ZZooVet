import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="
        mt-16
        bg-[#2F2A23]
        px-4
        py-12
        text-white
        sm:px-6
        lg:px-10
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
        "
      >
        {/* Верхня частина */}
        <div
          className="
            grid
            gap-10
            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          {/* ЛОГО */}
          <div>
            <Link
              href="/"
              aria-label="300VetСвіт"
              className="
            hidden
            shrink-0
            items-center
            lg:flex
          "
            >
              <Image
                src="/logo.svg"
                alt="300VetСвіт"
                width={70}
                height={70}
                className="
              h-[clamp(2.75rem,5vw,4.25rem)]
              w-[clamp(2.75rem,5vw,4.25rem)]
              object-contain
            "
              />
            </Link>

            <p
              className="
                mt-4
                max-w-xs
                text-sm
                leading-relaxed
                text-white/70
              "
            >
              Все необхідне для щасливого життя ваших улюбленців.
            </p>
          </div>

          {/* КАТАЛОГ */}
          <div>
            <h3 className="font-semibold">Каталог</h3>

            <nav
              className="
                mt-4
                flex
                flex-col
                gap-2
                text-sm
                text-white/70
              "
            >
              <Link href="/catalog/dogs" className="hover:text-white">
                Собакам
              </Link>

              <Link href="/catalog/cats" className="hover:text-white">
                Котам
              </Link>

              <Link href="/catalog/other" className="hover:text-white">
                Іншим тваринам
              </Link>

              <Link href="/catalog/food" className="hover:text-white">
                Корм
              </Link>

              <Link href="/catalog/treats" className="hover:text-white">
                Ласощі
              </Link>
            </nav>
          </div>

          {/* ПОКУПЦЯМ */}
          <div>
            <h3 className="font-semibold">Покупцям</h3>

            <nav
              className="
                mt-4
                flex
                flex-col
                gap-2
                text-sm
                text-white/70
              "
            >
              <Link href="/delivery" className="hover:text-white">
                Доставка
              </Link>

              <Link href="/payment" className="hover:text-white">
                Оплата
              </Link>

              <Link href="/returns" className="hover:text-white">
                Повернення
              </Link>

              <Link href="/contacts" className="hover:text-white">
                Контакти
              </Link>
            </nav>
          </div>

          {/* КОНТАКТИ */}
          <div>
            <h3 className="font-semibold">Контакти</h3>

            <div
              className="
                mt-4
                flex
                flex-col
                gap-3
                text-sm
                text-white/70
              "
            >
              <a href="tel:+380000000000" className="hover:text-white">
                +380 XX XXX XX XX
              </a>

              <a href="mailto:info@300vet.com" className="hover:text-white">
                info@300vet.com
              </a>

              <span>Україна</span>
            </div>
          </div>
        </div>

        {/* Нижня частина */}
        <div
          className="
            mt-10
            flex
            flex-col
            gap-4
            border-t
            border-white/10
            pt-6
            text-sm
            text-white/50
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>© 2026 300VetСвіт. Усі права захищені.</p>

          <div className="flex gap-5">
            <Link href="#" className="hover:text-white">
              Instagram
            </Link>

            <Link href="#" className="hover:text-white">
              Facebook
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
