"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserRound, Save, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const supabase = createClient();

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!active) return;

        if (authError || !user) {
          router.replace("/account");
          return;
        }

        setUserId(user.id);
        setEmail(user.email ?? "");

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name, phone, email")
          .eq("id", user.id)
          .maybeSingle();

        if (!active) return;

        if (profileError) {
          setErrorMessage("Не вдалося завантажити дані профілю.");
        }

        setFirstName(
          profile?.first_name ?? user.user_metadata?.first_name ?? ""
        );
        setLastName(profile?.last_name ?? user.user_metadata?.last_name ?? "");
        setPhone(profile?.phone ?? user.user_metadata?.phone ?? "");
        setEmail(profile?.email || user.email || "");
      } catch {
        if (active) {
          setErrorMessage("Помилка завантаження. Спробуйте оновити сторінку.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId) return;

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { error } = await supabase.from("profiles").upsert(
        {
          id: userId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error("PROFILE SAVE ERROR:", JSON.stringify(error, null, 2));

        setErrorMessage(
          "Не вдалося зберегти дані. Перевірте права доступу до таблиці profiles."
        );
        return;
      }

      setMessage("Ваші дані успішно збережено.");
      window.dispatchEvent(new Event("auth-success"));
    } catch {
      setErrorMessage("Сталася помилка під час збереження.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#E9E3D8] bg-white px-4 py-3 text-[#4A3528] outline-none transition placeholder:text-gray-400 focus:border-[#66852A] focus:ring-2 focus:ring-[#66852A]/15";

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F7F5EF]">
        <p className="text-gray-500">Завантажуємо ваші дані...</p>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#F7F5EF] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#66852A]"
        >
          <ArrowLeft size={17} />
          До особистого кабінету
        </Link>

        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF0DF] text-[#66852A]">
            <UserRound size={28} />
          </div>

          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#66852A]">
            ЗООVet Світ
          </p>
          <h1 className="text-3xl font-bold text-[#4A3528] sm:text-4xl">
            Мої дані
          </h1>
          <p className="mt-2 text-gray-600">
            Переглядайте та змінюйте свої особисті дані.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-[#E9E3D8] bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[#4A3528]">
              Ім’я
              <input
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Введіть ім’я"
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-medium text-[#4A3528]">
              Прізвище
              <input
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Введіть прізвище"
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-medium text-[#4A3528] sm:col-span-2">
              Електронна пошта
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={inputClass}
              />
              <span className="mt-2 block text-xs font-normal text-gray-500">
                Зміна тут оновлює контактну адресу в профілі магазину, але не
                змінює email для входу в Supabase.
              </span>
            </label>

            <label className="block text-sm font-medium text-[#4A3528] sm:col-span-2">
              Номер телефону
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+380 __ ___ __ __"
                className={inputClass}
              />
            </label>
          </div>

          {message && (
            <p className="mt-5 flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 size={18} />
              {message}
            </p>
          )}

          {errorMessage && (
            <p role="alert" className="mt-5 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <div className="mt-7 flex flex-col gap-3 border-t border-[#F0ECE4] pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/account"
              className="inline-flex items-center justify-center rounded-xl border border-[#E9E3D8] px-5 py-3 text-sm font-medium text-[#4A3528] transition hover:bg-[#F7F5EF]"
            >
              Скасувати
            </Link>

            <button
              type="submit"
              disabled={saving || !userId}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#66852A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#587522] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {saving ? "Зберігаємо..." : "Зберегти зміни"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
