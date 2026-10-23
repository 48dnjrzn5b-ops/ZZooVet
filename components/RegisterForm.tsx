"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type RegisterFormProps = {
  onLogin: () => void;
};

export default function RegisterForm({ onLogin }: RegisterFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("Введіть ім’я та прізвище.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Пароль має містити щонайменше 6 символів.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Паролі не збігаються.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: `${firstName.trim()} ${lastName.trim()}`,
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          setErrorMessage("Користувач із таким email уже зареєстрований.");
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      if (data.session) {
        window.dispatchEvent(new Event("auth-success"));
        setSuccessMessage("Акаунт успішно створено!");

        router.refresh();
        setTimeout(() => {
          router.push("/account");
          router.refresh();
        }, 1000);
      } else {
        setSuccessMessage(
          "Акаунт створено. Підтвердіть email, якщо це потрібно, а потім увійдіть."
        );
      }

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Помилка реєстрації:", error);
      setErrorMessage("Не вдалося створити акаунт. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#66852A] focus:ring-1 focus:ring-[#66852A]";

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Ім’я
        </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Ваше ім’я"
          autoComplete="given-name"
          required
          className={inputClassName}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Прізвище
        </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Ваше прізвище"
          autoComplete="family-name"
          required
          className={inputClassName}
        />
      </div>

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
          className={inputClassName}
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
          autoComplete="new-password"
          minLength={6}
          required
          className={inputClassName}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Підтвердження пароля
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Повторіть пароль"
          autoComplete="new-password"
          minLength={6}
          required
          className={inputClassName}
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

      {successMessage && (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full rounded-xl bg-[#66852A] py-3 font-medium text-white transition hover:bg-[#587522] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Створюємо акаунт..." : "Створити акаунт"}
      </button>

      <div className="border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
        Вже маєте акаунт?{" "}
        <button
          type="button"
          onClick={onLogin}
          className="font-medium text-[#66852A] hover:underline"
        >
          Увійти
        </button>
      </div>
    </form>
  );
}
