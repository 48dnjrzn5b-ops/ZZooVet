import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      className="
    w-full
    px-0
    py-0
    lg:px-10
    lg:py-8
  "
    >
      <div
        className="
      relative
      w-full
      overflow-hidden
      rounded-none
      lg:rounded-[24px]
      mx-auto
      lg:max-w-[1400px]
    "
      >
        {/* Фон */}
        <Image
          src="/hero-bg.jpg"
          alt=""
          width={1920}
          height={700}
          priority
          className="
        block
        h-auto
        w-full
      "
        />

        {/* Контент */}
        <div className="absolute inset-0 flex items-center">
          <div
            className="
          w-[48%]
          pl-[5%]
        "
          >
            <h1
              className="
            font-heading
            text-[clamp(1rem,3vw,3rem)]
            font-bold
            text-[#202828]
            leading-relaxed
          "
            >
              Турбота про улюбленців
              <span className="block text-[#16877D]">починається тут</span>
            </h1>

            <p
              className="
            mt-[1.2vw]
            text-[clamp(0.55rem,1.15vw,1.15rem)]
            text-[#303535]
            leading-normal
          "
            >
              Якісні товари для здоров`я, догляду
              <br />
              та щасливого життя ваших тварин
            </p>

            <Button
              className="
            mt-[1.5vw]
            h-[clamp(1.8rem,3.5vw,3.5rem)]
            rounded-lg
            bg-[#FF7417]
            px-[clamp(0.7rem,2vw,1.8rem)]
            text-[clamp(0.55rem,1vw,1rem)]
            hover:bg-[#e9660e]
          "
            >
              Перейти в каталог
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
