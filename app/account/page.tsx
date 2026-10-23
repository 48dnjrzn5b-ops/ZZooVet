"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserRound,
  Package,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  PawPrint,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      console.log("ACCOUNT USER:", data.user);
      console.log("ACCOUNT ERROR:", error);

      if (!active) return;

      if (error || !data.user) {
        console.error("Помилка отримання користувача:", error);

        setIsLoading(false);
        return;
      }

      setEmail(data.user.email ?? "");
      setName(
        data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          "Покупець"
      );
      setIsLoading(false);
    }

    void loadUser();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  async function handleSignOut() {
    setIsSigningOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setIsSigningOut(false);
      return;
    }

    window.dispatchEvent(new Event("auth-success"));
    router.replace("/");
    router.refresh();
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Завантажуємо кабінет...</p>
      </main>
    );
  }

  const sections = [
    {
      title: "Мої замовлення",
      description: "Переглядайте свої покупки та статуси замовлень",
      icon: Package,
      href: "/account/orders",
    },
    {
      title: "Обране",
      description: "Товари, які ви зберегли для себе",
      icon: Heart,
      href: "/account/favorites",
    },
    {
      title: "Мої дані",
      description: "Інформація про ваш акаунт",
      icon: UserRound,
      href: "/account/profile",
    },
    {
      title: "Доставка",
      description: "Ваші контактні та адресні дані",
      icon: MapPin,
      href: "/account/profile",
    },
  ];

  return (
    <main className="min-h-[70vh] bg-[#F7F5EF] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#66852A]"
          >
            <PawPrint size={17} />
            На головну
          </Link>

          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#66852A]">
            ЗООVet Світ
          </p>
          <h1 className="text-3xl font-bold text-[#4A3528] sm:text-4xl">
            Особистий кабінет
          </h1>
          <p className="mt-2 text-gray-600">
            Усе важливе про ваші покупки — в одному місці.
          </p>
        </div>

        <section className="mb-8 rounded-2xl border border-[#E9E3D8] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EAF0DF] text-[#66852A]">
              <UserRound size={30} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500">Раді вас бачити!</p>
              <h2 className="mt-1 break-words text-2xl font-semibold text-[#4A3528]">
                {name}
              </h2>
              <p className="mt-1 break-all text-sm text-gray-500">{email}</p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:text-red-600 disabled:opacity-60 sm:self-center"
            >
              <LogOut size={17} />
              {isSigningOut ? "Виходимо..." : "Вийти"}
            </button>
          </div>
        </section>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[#4A3528]">Мій кабінет</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.title}
                href={section.href}
                className="group flex items-center gap-4 rounded-2xl border border-[#E9E3D8] bg-white p-5 transition hover:border-[#C8D6AE] hover:shadow-sm sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0F3E9] text-[#66852A]">
                  <Icon size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#4A3528]">
                    {section.title}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    {section.description}
                  </p>
                </div>

                <ChevronRight
                  size={20}
                  className="shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#66852A]"
                />
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl bg-[#EAF0DF] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <PawPrint size={26} className="mt-1 shrink-0 text-[#66852A]" />
            <div>
              <h2 className="text-lg font-semibold text-[#4A3528]">
                Турбота про ваших улюбленців
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#665C50]">
                Зберігайте улюблені товари та стежте за своїми замовленнями. Ми
                допоможемо подбати про ваших хвостиків!
              </p>
              <Link
                href="/catalog"
                className="mt-4 inline-flex items-center gap-2 font-medium text-[#587522] hover:underline"
              >
                Перейти до каталогу
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
