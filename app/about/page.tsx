import { Heart, PawPrint, GraduationCap, Stethoscope } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-[#FFFDF8] text-[#333]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F3F6E8]">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#DCE8C5] opacity-70" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#F4E6D8] opacity-70" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <div className="mb-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
              <Heart size={27} strokeWidth={1.8} className="text-[#66852A]" />
            </div>
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#66852A]">
            Про нас
          </p>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-[#344126] md:text-6xl">
            З любові, яка стала справою
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#68705C] md:text-lg">
            Історія ЗООVet Світ — це історія любові до тварин, яка з часом
            переросла у професійну справу.
          </p>
        </div>
      </section>

      {/* HISTORY */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:items-start">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#66852A]">
              Наша історія
            </span>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-[#344126] md:text-4xl">
              Усе почалося задовго до появи магазину
            </h2>
          </div>

          <div className="space-y-5 text-[16px] leading-8 text-[#555]">
            <p>
              Наша історія почалася задовго до появи
              <strong className="text-[#344126]"> «ЗООVet Світ»</strong>.
            </p>

            <p>
              Ще зі шкільних років ми не могли залишатися байдужими до тварин.
              Допомагали притулкам, долучалися до волонтерських ініціатив,
              привозили корм і необхідні речі тваринам, яким просто не було кому
              допомогти.
            </p>

            <p>
              Саме тоді ми вперше зрозуміли: турбота про тварину — це набагато
              більше, ніж просто нагодувати її чи купити щось необхідне.
            </p>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="bg-[#F8F5EE]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4E4]">
                <PawPrint className="text-[#66852A]" size={24} />
              </div>

              <h3 className="mb-3 text-xl font-bold text-[#344126]">
                Любов до тварин
              </h3>

              <p className="leading-7 text-[#666]">
                Допомога притулкам, волонтерство та щире бажання піклуватися про
                тих, хто потребує допомоги.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4E9DE]">
                <GraduationCap className="text-[#B86B45]" size={24} />
              </div>

              <h3 className="mb-3 text-xl font-bold text-[#344126]">
                Професійні знання
              </h3>

              <p className="leading-7 text-[#666]">
                Ми здобули освіту у сфері зоотехнології та продовжуємо
                поглиблювати свої знання про харчування й догляд.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F3F1]">
                <Stethoscope className="text-[#16877D]" size={24} />
              </div>

              <h3 className="mb-3 text-xl font-bold text-[#344126]">
                Турбота без зайвого
              </h3>

              <p className="leading-7 text-[#666]">
                Ми прагнемо пояснювати просто, чесно та спокійно і підказувати,
                коли справді потрібна допомога ветеринара.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ZOOVET */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#66852A]">
            Так народився ЗООVet Світ
          </span>

          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight text-[#344126] md:text-4xl">
            Більше, ніж просто магазин для тварин
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-8 text-[#666]">
            Ми створили його не просто як магазин, де можна купити корм чи
            ласощі. Нам хотілося створити місце, куди можна прийти із запитанням
            і отримати спокійну, чесну та професійну пораду.
          </p>
        </div>

        {/* QUESTIONS */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#E8E5DC] bg-white p-6">
            <p className="text-lg font-semibold leading-7 text-[#344126]">
              «Щось змінилося у моєї собаки — що мені робити?»
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E5DC] bg-white p-6">
            <p className="text-lg font-semibold leading-7 text-[#344126]">
              «Чи підходить їй цей корм?»
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E5DC] bg-white p-6">
            <p className="text-lg font-semibold leading-7 text-[#344126]">
              «Чому кіт так поводиться?»
            </p>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="bg-[#344126] text-white">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-24">
          <PawPrint
            size={38}
            strokeWidth={1.5}
            className="mx-auto mb-7 text-[#C5D69D]"
          />

          <h2 className="text-3xl font-bold md:text-4xl">
            Поруч, коли це справді важливо
          </h2>

          <div className="mx-auto mt-8 max-w-3xl space-y-6 text-[16px] leading-8 text-[#E8EDE0]">
            <p>
              Ми віримо, що хороший спеціаліст — це не той, хто знаходить у
              кожній ситуації проблему, а той, хто вміє побачити її справжню
              суть, пояснити простими словами і вчасно підказати, коли дійсно
              потрібна допомога ветеринарного лікаря.
            </p>

            <p>
              Бо ми добре знаємо: коли хворіє улюбленець, його людина хвилюється
              разом із ним. І в цей момент особливо важливо, щоб поруч була
              людина, якій можна довіряти.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="rounded-[2rem] bg-[#F3F6E8] px-7 py-12 text-center md:px-16 md:py-16">
          <h2 className="text-3xl font-bold text-[#344126] md:text-4xl">
            Кожна тварина — це чиясь родина
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-8 text-[#5E6654]">
            Для нас кожна тварина — не просто клієнт і не просто черговий
            продаж. Це чийсь друг, член родини, маленьке життя, за яке ми
            відповідаємо разом.
          </p>
        </div>
      </section>

      {/* FINAL */}
      <section className="border-t border-[#ECE8DE] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-24">
          <span className="text-4xl">🐾</span>

          <h2 className="mt-6 text-3xl font-bold leading-tight text-[#344126] md:text-4xl">
            Наша мрія — бути місцем, якому довіряють
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-8 text-[#666]">
            Щоб у ЗООVet Світ знали, допомогли, не налякали зайвим і до кожного
            улюбленця ставилися так, як до свого.
          </p>

          <div className="mx-auto mt-10 h-px w-20 bg-[#66852A]" />

          <p className="mt-8 text-lg font-semibold text-[#66852A]">
            З любові до тварин усе почалося 🐾
          </p>

          <p className="mt-3 text-base text-[#777]">
            І саме любов залишається нашим головним орієнтиром сьогодні 🩶
          </p>
        </div>
      </section>
    </main>
  );
}
