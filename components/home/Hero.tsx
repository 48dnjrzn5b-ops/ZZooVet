import Image from "next/image";
import Link from "next/link";
import { Percent, ShieldCheck, Tag, Truck, Heart } from "lucide-react";

const advantages = [
  {
    icon: ShieldCheck,
    title: "Перевірена якість",
  },
  {
    icon: Tag,
    title: "Доступні ціни",
  },
  {
    icon: Truck,
    title: "Швидка доставка",
  },
  {
    icon: Heart,
    title: "Любов до тварин",
  },
];

export default function Hero() {
  return (
    <section className="w-full">
      <div
        className="
          relative
          mx-auto
          w-full
          overflow-hidden
          rounded-none
          lg:max-w-[1900px]
        "
      >
        {/* =========================
            ФОНОВЕ ЗОБРАЖЕННЯ
        ========================== */}
        <div
          className="
            relative
            h-[540px]
            w-full
            sm:h-[520px]
            lg:h-[650px]
          "
        >
          {/* =========================
              ДЕСКТОП
          ========================== */}
          <Image
            src="/hero-bg4.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 100vw, 0px"
            className="
              hidden
              object-cover
              object-[20%_0%]
              lg:block
            "
          />

          {/* =========================
              МОБІЛКА
          ========================== */}
          <Image
            src="/hero-bg4.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 1023px) 100vw"
            className="
              block
              object-cover
              object-[80%_100%]
              lg:hidden
            "
          />
        </div>

        {/* =========================
            КОНТЕНТ
        ========================== */}
        <div
          className="
            absolute
            inset-0
          "
        >
          <div
            className="
              mx-auto
              flex
              h-full
              w-full
              max-w-7xl
              flex-col
              justify-between
              px-5
              py-6

              sm:px-6
              sm:py-10

              lg:flex-row
              lg:items-center
              lg:px-10
              lg:py-0
            "
          >
            {/* =========================
                КОЛОНКА З КОНТЕНТОМ (на десктопі єдина, на мобілці розділена flex-col/justify-between)
            ========================== */}
            <div
              className="
                flex
                h-full
                w-full
                flex-col
                justify-between

                sm:w-[70%]

                lg:h-auto
                lg:w-[55%]
                lg:justify-start
                lg:pl-0
              "
            >
              {/* ЗАГОЛОВОК (ЗВЕРХУ) */}
              <div className="w-full text-center sm:text-left">
                <h1
                  className="
                    mx-auto
                    max-w-[700px]
                    font-heading
                    text-[1.85rem]
                    font-bold
                    leading-[1]
                    text-[#202828]

                    sm:mx-0
                    sm:text-[clamp(2rem,4vw,3rem)]

                    lg:text-[clamp(2.2rem,3.5vw,3rem)]
                  "
                >
                  Усе, що потрібно
                  <span className="block text-[#F77601] mt-4">
                    для вашого улюбленця
                  </span>
                </h1>
              </div>

              {/* ОПИС І КНОПКИ (ЗНИЗУ НА МОБІЛЦІ, ПІД ЗАГОЛОВКОМ НА ДЕСКОПІ) */}
              <div className="pb-1 lg:pb-0">
                <p
                  className="
                    max-w-[520px]
                    text-[0.95rem]
                    leading-[1.4]
                    text-[#303535]

                    sm:text-[clamp(1rem,1.5vw,1.15rem)]

                    lg:mt-4
                  "
                >
                  Якісні товари для здоров’я, догляду
                  <br className="hidden sm:inline" />
                  та щасливого життя ваших тварин
                </p>

                {/* КНОПКИ */}
                <div
                  className="
                    mt-4
                    flex
                    w-full
                    flex-col
                    items-stretch
                    gap-2.5

                    sm:flex-row
                    sm:items-center
                    sm:gap-3

                    lg:mt-10
                  "
                >
                  {/* ПЕРЕЙТИ В КАТАЛОГ */}
                  <Link
                    href="/catalog"
                    className="
                      flex
                      h-11
                      w-full
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#66852A]
                      px-6
                      text-base
                      font-medium
                      text-white
                      transition-colors
                      hover:bg-[#F77601]

                      sm:h-12
                      sm:w-auto
                      sm:max-w-[300px]
                    "
                  >
                    Перейти в каталог
                  </Link>

                  {/* АКЦІЇ ТА ЗНИЖКИ */}
                  <Link
                    href="/catalog/sale"
                    className="
                      flex
                      h-11
                      w-full
                      items-center
                      justify-center
                      gap-1.5
                      rounded-xl
                      border-2
                      border-[#66852A]
                      bg-white/85
                      px-5
                      text-base
                      font-medium
                      text-[#66852A]
                      backdrop-blur-sm
                      transition-colors
                      hover:bg-[#66852A]/10

                      sm:h-12
                      sm:w-auto
                      sm:max-w-[300px]
                    "
                  >
                    <Percent className="h-[1em] w-[1em]" strokeWidth={2.5} />
                    Акції та знижки
                  </Link>
                </div>
              </div>
            </div>

            {/* ПЕРЕВАГИ (Тільки десктоп / планшет під основною частиною) */}
            <div
              className="
                mt-6
                hidden
                flex-wrap
                items-center
                gap-x-8
                gap-y-4

                sm:flex

                lg:absolute
                lg:bottom-10
              "
            >
              {advantages.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="
                      flex
                      flex-col
                      items-center
                      text-center
                    "
                  >
                    <Icon
                      className="h-10 w-10 text-[#66852A]"
                      strokeWidth={1.4}
                    />

                    <span
                      className="
                        mt-2
                        max-w-[100px]
                        text-xs
                        font-medium
                        leading-tight
                        text-[#202828]
                        sm:text-sm
                      "
                    >
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
