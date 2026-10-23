"use client";

import { X } from "lucide-react";
import { useState } from "react";

import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

type AuthModalProps = {
  onClose: () => void;
};

export default function AuthModal({ onClose }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        items-center
        justify-center
        bg-black/40
        px-4
        py-6
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full
          max-w-md
          rounded-2xl
          bg-white
          p-7
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="
            absolute
            right-4
            top-4
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            text-gray-400
            transition
            hover:bg-gray-100
            hover:text-gray-700
          "
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER */}

        <div className="mb-7 pr-8">
          <h2 className="text-2xl font-semibold text-[#3F4A32]">
            {isRegister ? "Створити акаунт" : "Увійти в акаунт"}
          </h2>

          <p className="mt-2 text-sm leading-5 text-gray-500">
            {isRegister
              ? "Зареєструйтеся, щоб користуватися всіма можливостями"
              : "Увійдіть, щоб переглядати свої замовлення"}
          </p>
        </div>

        {/* FORM */}

        {isRegister ? (
          <RegisterForm onLogin={() => setIsRegister(false)} />
        ) : (
          <LoginForm onRegister={() => setIsRegister(true)} />
        )}
      </div>
    </div>
  );
}
