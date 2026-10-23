import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsAccountForm from "./SettingsAccountForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("email, first_name, last_name, role")
    .eq("id", user.id)
    .single();

  if (error || profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <section className="min-w-0 flex-1 bg-[#F7F5EF] p-4 text-[#4A3528] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm text-[#887969]">
            Адміністративна панель / Налаштування
          </p>

          <h1 className="text-2xl font-bold sm:text-3xl">Налаштування</h1>

          <p className="mt-2 text-sm text-[#887969]">
            Керування обліковим записом адміністратора
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-[#E8E0D5] bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Мій обліковий запис</h2>

          <p className="mt-1 text-sm text-[#887969]">
            {[profile.first_name, profile.last_name]
              .filter(Boolean)
              .join(" ") || "Адміністратор"}
          </p>

          <p className="mt-2 break-all text-sm">
            Поточний email: {user.email || profile.email || "Не вказано"}
          </p>
        </div>

        <SettingsAccountForm currentEmail={user.email || profile.email || ""} />
      </div>
    </section>
  );
}
