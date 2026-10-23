"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type LoginFormProps = {
  onRegister: () => void;
};

export default function LoginForm({ onRegister }: LoginFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error("SUPABASE LOGIN ERROR:", error.message);
        setErrorMessage(error.message);
        return;
      }

      if (!data.user || !data.session) {
        setErrorMessage("Не вдалося створити сесію. Спробуйте ще раз.");
        return;
      }
      console.log("ВХІД: користувач", data.user?.id);
      console.log("ВХІД: сесія створена", Boolean(data.session));

      window.dispatchEvent(new Event("auth-success"));

      // Адміністратор переходить в адмінпанель,
      // звичайний покупець — на головну сторінку.
      if (data.user.user_metadata?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/account");
      }

      router.refresh();

      router.refresh();
    } catch (error) {
      console.error("Помилка входу:", error);
      setErrorMessage("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          autoComplete="email"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#66852A] focus:ring-1 focus:ring-[#66852A]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Пароль
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введіть пароль"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#66852A] focus:ring-1 focus:ring-[#66852A]"
        />
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full rounded-xl bg-[#66852A] py-3 font-medium text-white transition hover:bg-[#587522] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Входимо..." : "Увійти"}
      </button>

      <button
        type="button"
        onClick={() => setErrorMessage("Відновлення пароля ще не підключено.")}
        className="block w-full text-center text-sm text-[#66852A] hover:underline"
      >
        Забули пароль?
      </button>

      <div className="border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
        Ще не маєте акаунта?{" "}
        <button
          type="button"
          onClick={onRegister}
          className="font-medium text-[#66852A] hover:underline"
        >
          Зареєструватися
        </button>
      </div>
    </form>
  );
}
