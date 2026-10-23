"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  currentEmail: string;
};

export default function SettingsAccountForm({ currentEmail }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function handleEmailChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setEmailMessage("");
    setEmailError("");

    const newEmail = email.trim().toLowerCase();

    if (!newEmail) {
      setEmailError("Введіть новий email.");
      return;
    }

    if (newEmail === currentEmail.toLowerCase()) {
      setEmailError("Це вже ваш поточний email.");
      return;
    }

    setEmailLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        setEmailError(error.message);
        return;
      }

      setEmailMessage(
        "Запит прийнято. Перевірте пошту та виконайте інструкції Supabase для підтвердження нової адреси."
      );

      setEmail("");
    } catch {
      setEmailError("Не вдалося змінити email. Спробуйте ще раз.");
    } finally {
      setEmailLoading(false);
    }
  }

  async function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (password.length < 8) {
      setPasswordError("Пароль має містити щонайменше 8 символів.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Паролі не збігаються.");
      return;
    }

    setPasswordLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setPasswordError(error.message);
        return;
      }

      setPasswordMessage("Пароль успішно змінено.");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordError("Не вдалося змінити пароль. Спробуйте ще раз.");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E8E0D5] bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Зміна email</h2>

        <p className="mt-2 text-sm text-[#887969]">
          Після зміни адреси може знадобитися підтвердження через електронну
          пошту.
        </p>

        <form onSubmit={handleEmailChange} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="new-email"
              className="mb-2 block text-sm font-medium"
            >
              Новий email
            </label>

            <input
              id="new-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-[#E8E0D5] bg-white px-4 py-3 outline-none focus:border-[#66852A] focus:ring-1 focus:ring-[#66852A]"
            />
          </div>

          {emailError && (
            <p role="alert" className="text-sm text-red-600">
              {emailError}
            </p>
          )}

          {emailMessage && (
            <p role="status" className="text-sm text-green-700">
              {emailMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={emailLoading}
            className="rounded-xl bg-[#66852A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#587522] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {emailLoading ? "Обробка..." : "Змінити email"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-[#E8E0D5] bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Зміна пароля</h2>

        <p className="mt-2 text-sm text-[#887969]">
          Використовуйте надійний пароль, який не застосовуєте на інших сайтах.
        </p>

        <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-sm font-medium"
            >
              Новий пароль
            </label>

            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Щонайменше 8 символів"
              className="w-full rounded-xl border border-[#E8E0D5] bg-white px-4 py-3 outline-none focus:border-[#66852A] focus:ring-1 focus:ring-[#66852A]"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm font-medium"
            >
              Повторіть новий пароль
            </label>

            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Повторіть пароль"
              className="w-full rounded-xl border border-[#E8E0D5] bg-white px-4 py-3 outline-none focus:border-[#66852A] focus:ring-1 focus:ring-[#66852A]"
            />
          </div>

          {passwordError && (
            <p role="alert" className="text-sm text-red-600">
              {passwordError}
            </p>
          )}

          {passwordMessage && (
            <p role="status" className="text-sm text-green-700">
              {passwordMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="rounded-xl bg-[#66852A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#587522] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {passwordLoading ? "Обробка..." : "Змінити пароль"}
          </button>
        </form>
      </section>
    </div>
  );
}
