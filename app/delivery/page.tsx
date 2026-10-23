import Link from "next/link";
import {
  Truck,
  MapPin,
  CreditCard,
  Store,
  PackageCheck,
  MessageCircle,
} from "lucide-react";

export default function DeliveryPage() {
  return (
    <main className="bg-[#FFFDF8] text-[#333]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F3F6E8]">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#DCE8C5] opacity-70" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#F4E6D8] opacity-70" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
            <Truck size={27} strokeWidth={1.8} className="text-[#66852A]" />
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#66852A]">
            ЗООVet Світ
          </p>

          <h1 className="text-4xl font-bold leading-tight text-[#344126] md:text-6xl">
            Оплата та доставка
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#68705C] md:text-lg">
            Обирайте зручний спосіб отримання та оплати вашого замовлення.
          </p>
        </div>
      </section>

      {/* DELIVERY */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#66852A]">
            Доставка
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[#344126] md:text-4xl">
            Доставка по Україні
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* НОВА ПОШТА */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#ECE8DE] transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4E4]">
              <PackageCheck size={27} className="text-[#66852A]" />
            </div>

            <h3 className="text-2xl font-bold text-[#344126]">Нова пошта</h3>

            <ul className="mt-6 space-y-4 text-[#666]">
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#66852A]" />
                <span>Доставка у відділення або поштомат.</span>
              </li>

              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#66852A]" />
                <span>
                  Термін доставки — <strong>1–3 дні</strong>.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#66852A]" />
                <span>Вартість — відповідно до тарифів Нової пошти.</span>
              </li>

              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#66852A]" />
                <span>
                  <strong>Безкоштовна доставка від 1500 грн.</strong>
                </span>
              </li>
            </ul>
          </div>

          {/* КУР'ЄР */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#ECE8DE] transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4E9DE]">
              <Truck size={27} className="text-[#B86B45]" />
            </div>

            <h3 className="text-2xl font-bold text-[#344126]">
              Кур’єрська доставка
            </h3>

            <p className="mt-6 leading-8 text-[#666]">
              Доставка замовлення кур’єром Нової пошти
              <strong className="text-[#344126]"> до дверей</strong>.
            </p>

            <div className="mt-6 rounded-2xl bg-[#F8F5EE] p-5">
              <p className="text-sm leading-6 text-[#666]">
                Вартість доставки — відповідно до тарифів перевізника.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SELF PICKUP */}
      <section className="bg-[#F8F5EE]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm md:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7F3F1]">
              <Store size={27} className="text-[#16877D]" />
            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#344126]">
              🐾 Самовивіз
            </h2>

            <p className="mt-5 leading-8 text-[#666]">
              Забрати замовлення можна в наших магазинах у Києві.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#EEF4E4] px-5 py-3 text-sm font-semibold text-[#66852A]">
              <MapPin size={18} />
              Безкоштовно та за попереднім узгодженням
            </div>
          </div>
        </div>
      </section>

      {/* PAYMENT */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#66852A]">
            Оплата
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[#344126] md:text-4xl">
            Зручні способи оплати
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* ONLINE */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#ECE8DE]">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4E4]">
              <CreditCard size={27} className="text-[#66852A]" />
            </div>

            <h3 className="text-xl font-bold text-[#344126]">Онлайн карткою</h3>

            <p className="mt-4 leading-7 text-[#666]">
              Оплата банківською карткою
              <strong className="text-[#344126]"> Visa / Mastercard</strong> під
              час оформлення замовлення.
            </p>
          </div>

          {/* НАКЛАДЕНИЙ ПЛАТІЖ */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#ECE8DE]">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4E9DE]">
              <PackageCheck size={27} className="text-[#B86B45]" />
            </div>

            <h3 className="text-xl font-bold text-[#344126]">При отриманні</h3>

            <p className="mt-4 leading-7 text-[#666]">
              Оплата замовлення при отриманні через
              <strong className="text-[#344126]">
                {" "}
                післяплату Нової пошти.
              </strong>
            </p>

            <p className="mt-4 text-sm leading-6 text-[#777]">
              Комісія за післяплату оплачується отримувачем відповідно до
              тарифів перевізника.
            </p>
          </div>

          {/* МАГАЗИН */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#ECE8DE]">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7F3F1]">
              <Store size={27} className="text-[#16877D]" />
            </div>

            <h3 className="text-xl font-bold text-[#344126]">У магазині</h3>

            <p className="mt-4 leading-7 text-[#666]">
              При самовивозі можна оплатити замовлення
              <strong className="text-[#344126]"> карткою або готівкою.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="px-6 pb-16 md:pb-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#344126] px-7 py-14 text-center text-white md:px-16 md:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <MessageCircle size={27} className="text-[#DCE8C5]" />
          </div>

          <h2 className="mt-6 text-3xl font-bold md:text-4xl">
            🤍 Не знаєте, що обрати?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#E8EDE0]">
            Напишіть нам — допоможемо підібрати корм, ласощі чи необхідні товари
            саме для вашого улюбленця.
          </p>

          <Link
            href="/#contacts"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#66852A] px-7 py-3.5 font-semibold text-white transition hover:bg-[#587522]"
          >
            Написати нам
          </Link>
        </div>
      </section>
    </main>
  );
}
