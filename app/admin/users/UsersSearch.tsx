"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
};

type UsersSearchProps = {
  users: User[];
};

export default function UsersSearch({ users }: UsersSearchProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("uk-UA");

    if (!query) return users;

    return users.filter((user) => {
      const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`;

      return [fullName, user.first_name, user.last_name, user.email].some(
        (value) => (value ?? "").toLocaleLowerCase("uk-UA").includes(query)
      );
    });
  }, [users, search]);

  const admins = filteredUsers.filter((user) => user.role === "admin").length;

  const customers = filteredUsers.filter(
    (user) => user.role === "customer"
  ).length;

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E8E0D5] bg-white p-5">
          <p className="text-sm text-[#887969]">Знайдено користувачів</p>
          <p className="mt-2 text-3xl font-bold">{filteredUsers.length}</p>
        </div>

        <div className="rounded-2xl border border-[#E8E0D5] bg-white p-5">
          <p className="text-sm text-[#887969]">Адміністратори</p>
          <p className="mt-2 text-3xl font-bold">{admins}</p>
        </div>

        <div className="rounded-2xl border border-[#E8E0D5] bg-white p-5">
          <p className="text-sm text-[#887969]">Покупці</p>
          <p className="mt-2 text-3xl font-bold">{customers}</p>
        </div>
      </div>

      <div className="mb-5">
        <label
          htmlFor="users-search"
          className="mb-2 block text-sm font-medium"
        >
          Пошук користувачів
        </label>

        <input
          id="users-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Введіть ім’я, прізвище або email..."
          className="w-full rounded-xl border border-[#E8E0D5] bg-white px-4 py-3 outline-none transition placeholder:text-[#A79A8C] focus:border-[#66852A] focus:ring-1 focus:ring-[#66852A]"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white">
        <div className="border-b border-[#E8E0D5] p-5">
          <h2 className="font-semibold">Список користувачів</h2>
        </div>

        {filteredUsers.length === 0 ? (
          <p className="p-6 text-sm text-[#887969]">
            {search.trim()
              ? "За вашим запитом нічого не знайдено."
              : "Користувачів поки немає."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-[#F7F5EF] text-[#887969]">
                <tr>
                  <th className="p-4 font-medium">Ім’я та прізвище</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Роль</th>
                  <th className="p-4 font-medium">Дата реєстрації</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-[#E8E0D5] hover:bg-[#FCFBF8]"
                  >
                    <td className="p-4 font-medium">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-[#66852A] underline-offset-4 transition hover:underline"
                      >
                        {[user.first_name, user.last_name]
                          .filter(Boolean)
                          .join(" ") || "Не вказано"}
                      </Link>
                    </td>

                    <td className="p-4">{user.email ?? "Немає email"}</td>

                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-[#E8F3E5] text-[#456B3C]"
                            : "bg-[#F1EBF6] text-[#72558E]"
                        }`}
                      >
                        {user.role === "admin" ? "Адміністратор" : "Покупець"}
                      </span>
                    </td>

                    <td className="p-4 text-[#887969]">
                      {new Date(user.created_at).toLocaleDateString("uk-UA")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
