import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-3 sm:px-5">
      <div className="relative mx-auto h-[400px] w-full max-w-[1900px] overflow-hidden rounded-[24px] bg-[#E5F1EC] sm:h-[480px] sm:rounded-[28px] lg:h-[650px] xl:h-[720px]">
        <Image
          src="/hero-bg0.jpg"
          alt="Щасливі домашні улюбленці"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-[60%_bottom] sm:block sm:scale-125 lg:scale-135 xl:scale-140"
        />

        <div className="absolute inset-0 overflow-hidden sm:hidden">
          <Image
            src="/hero-bg0.jpg"
            alt="Щасливі домашні улюбленці"
            fill
            priority
            sizes="100vw"
            className="scale-110 object-contain object-left-bottom"
            style={{ transform: "translate(20px, -22px) scale(1.2)" }}
          />
        </div>

        <div className="relative z-10 flex h-[400px] items-center px-6 py-8 sm:h-[480px] sm:px-10 lg:h-[650px] lg:px-16 xl:h-[720px]">
          <div className="max-w-[520px] -translate-y-4 sm:translate-y-0">
            <p className="mb-3 text-lg font-semibold tracking-[0.18em]">
              <span className="text-[#F27B18]">Зoo</span>
              <span className="text-[#87A543]">Vet</span>
              <span className="text-[#058275]"> — турбота поруч</span>
            </p>

            <h1 className="text-3xl font-extrabold leading-tight text-[#243B2A] sm:text-4xl lg:text-5xl">
              Усе найкраще для ваших улюбленців
            </h1>

            <p className="mt-5 max-w-[420px] text-sm leading-relaxed text-[#435747] sm:text-base">
              Якісні товари, корисне харчування та щоденна турбота про тих, кого
              ми любимо.
            </p>

            <Link
              href="/catalog"
              className="mt-7 inline-flex rounded-full bg-[#F27B18] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#244A2D]"
            >
              Перейти до каталогу
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
