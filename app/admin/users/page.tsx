import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UsersSearch from "./UsersSearch";

export const dynamic = "force-dynamic";

type Profile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
};

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Перевіряємо авторизацію
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Перевіряємо роль адміністратора
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    redirect("/");
  }

  // Завантажуємо користувачів із Supabase
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <section className="min-w-0 flex-1 bg-[#F7F5EF] p-6 text-[#4A3528]">
        <h1 className="text-3xl font-bold">Користувачі</h1>

        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          Не вдалося завантажити користувачів: {error.message}
        </p>
      </section>
    );
  }

  const profiles = (users ?? []) as Profile[];

  return (
    <section className="min-w-0 flex-1 bg-[#F7F5EF] p-4 text-[#4A3528] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-sm text-[#887969]">
            Адміністративна панель / Користувачі
          </p>

          <h1 className="text-2xl font-bold sm:text-3xl">Користувачі</h1>

          <p className="mt-2 text-sm text-[#887969]">
            Усього зареєстровано: {profiles.length}
          </p>
        </div>

        <UsersSearch users={profiles} />
      </div>
    </section>
  );
}
