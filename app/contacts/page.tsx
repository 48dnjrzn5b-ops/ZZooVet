import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Truck } from "lucide-react";

const contacts = [
  {
    icon: Phone,
    title: "Телефон",
    value: "+38 099 123 45 67",
    href: "tel:+380991234567",
  },
  {
    icon: Mail,
    title: "Електронна пошта",
    value: "vetzoo016@gmail.com",
    href: "mailto:vetzoo016@gmail.com",
  },
  {
    icon: Clock,
    title: "Графік роботи",
    value: "Пн–Нд: 10:00–20:00",
    href: null,
  },
];

export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-[#F7F5EF] px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 text-sm text-[#777]">
          <Link href="/" className="hover:text-[#66852A]">
            Головна
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#4A3528]">Контакти</span>
        </nav>

        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#66852A]">
            ЗООVet Світ
          </p>
          <h1 className="text-3xl font-bold text-[#4A3528] sm:text-5xl">
            Контакти
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#716B62]">
            Ми завжди готові допомогти вам обрати найкраще для ваших улюбленців.
            Зв’яжіться з нами зручним для вас способом.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-[#4A3528]">
              Як з нами зв’язатися
            </h2>

            <div className="space-y-5">
              {contacts.map(({ icon: Icon, title, value, href }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#66852A]/10 text-[#66852A]">
                    <Icon size={22} />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm text-[#898379]">{title}</p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-1 inline-block font-semibold text-[#4A3528] transition hover:text-[#66852A]"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 font-semibold text-[#4A3528]">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-[#EAE7DF] pt-6">
              <p className="text-sm leading-6 text-[#716B62]">
                Маєте питання щодо товару, замовлення або доставки? Телефонуйте
                нам або пишіть на електронну пошту.
              </p>
            </div>
          </section>

          <section className="flex flex-col justify-between rounded-3xl bg-[#4A3528] p-6 text-white sm:p-8">
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#C0D59B]">
                <Truck size={28} />
              </div>
              <h2 className="text-2xl font-bold">
                Турбота про ваших улюбленців
              </h2>
              <p className="mt-4 leading-7 text-white/75">
                Допоможемо підібрати товари для ваших тварин і відповімо на
                запитання щодо замовлення.
              </p>

              <div className="mt-6 space-y-4 text-sm text-white/90">
                <p className="flex items-start gap-3">
                  <Truck size={19} className="mt-0.5 shrink-0 text-[#C0D59B]" />
                  Доставка Новою поштою — орієнтовно 1–3 дні
                </p>
                <p className="flex items-start gap-3">
                  <MapPin
                    size={19}
                    className="mt-0.5 shrink-0 text-[#C0D59B]"
                  />
                  Самовивіз у Києві — за домовленістю
                </p>
              </div>
            </div>

            <a
              href="tel:+380991234567"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#66852A] px-5 py-3 font-semibold text-white transition hover:bg-[#587522]"
            >
              <Phone size={18} className="mr-2" />
              Зателефонувати нам
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
