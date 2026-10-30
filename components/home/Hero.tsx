import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-3 sm:px-5">
      <div className="relative mx-auto h-[400px] w-full max-w-[1900px] overflow-hidden rounded-[24px] sm:h-[480px] sm:rounded-[28px] lg:h-[650px] xl:h-[720px]">
        <Image
          src="/hero-bg4.jpg"
          alt="Щасливі домашні улюбленці"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center] sm:object-center"
        />

        {/* Градієнт тільки на мобільних */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#E5EDE0]/95 via-[#E5EDE0]/65 to-transparent lg:hidden" />

        <div className="relative z-10 flex h-[400px] items-center px-6 py-8 sm:h-[480px] sm:px-10 lg:h-[650px] lg:px-16 xl:h-[720px]">
          <div className="max-w-[520px]">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-green-800">
              ZooVet — турбота поруч
            </p>

            <h1 className="text-3xl font-extrabold leading-tight text-[#243B2A] sm:text-4xl lg:text-5xl">
              Усе найкраще
              <br />
              для ваших улюбленців
            </h1>

            <p className="mt-5 max-w-[420px] text-sm leading-relaxed text-[#435747] sm:text-base">
              Якісні товари, корисне харчування та щоденна турбота про тих, кого
              ми любимо.
            </p>

            <Link
              href="/catalog"
              className="mt-7 inline-flex rounded-full bg-[#66852A] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#244A2D]"
            >
              Перейти до каталогу
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
