"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FolderTree,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Plus,
  X,
  Save,
  Trash2,
} from "lucide-react";

type Category = {
  id: string;
  title: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [parentId, setParentId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/categories", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Не вдалося завантажити категорії.");
      }

      setCategories(result.categories ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Сталася помилка завантаження."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories", {
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Не вдалося завантажити категорії.");
        }

        if (!cancelled) {
          setCategories(result.categories ?? []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Сталася помилка завантаження."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const mainCategories = categories
    .filter((category) => category.parent_id === null)
    .sort((a, b) => a.sort_order - b.sort_order);

  const getSubcategories = (categoryId: string) =>
    categories
      .filter((category) => category.parent_id === categoryId)
      .sort((a, b) => a.sort_order - b.sort_order);

  function toggleCategory(categoryId: string) {
    setExpanded((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    );
  }

  async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = newTitle.trim();

    if (!title) {
      setFormError("Введіть назву категорії.");
      return;
    }

    setSaving(true);
    setFormError("");
    setFormMessage("");
    setError("");

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          parent_id: parentId || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Не вдалося створити категорію.");
      }

      const createdCategory: Category = result.category;

      setCategories((current) => [...current, createdCategory]);

      if (createdCategory.parent_id) {
        setExpanded((current) =>
          current.includes(createdCategory.parent_id!)
            ? current
            : [...current, createdCategory.parent_id!]
        );
      }

      setNewTitle("");
      setParentId("");
      setShowForm(false);
      setFormMessage("Категорію успішно створено.");
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Сталася помилка створення категорії."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(category: Category) {
    const children = getSubcategories(category.id);

    const warning = children.length
      ? `\n\nУ цій категорії є ${children.length} підкатегорій. Спочатку потрібно видалити їх.`
      : "";

    const confirmed = window.confirm(
      `Ви справді хочете видалити «${category.title}»?${warning}\n\nПродовжити?`
    );

    if (!confirmed) return;

    setError("");
    setFormMessage("");
    setDeletingId(category.id);

    try {
      const response = await fetch(
        `/api/categories?id=${encodeURIComponent(category.id)}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Не вдалося видалити категорію.");
      }

      setCategories((current) =>
        current.filter((item) => item.id !== category.id)
      );

      setExpanded((current) => current.filter((id) => id !== category.id));

      setFormMessage(`Категорію «${category.title}» успішно видалено.`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Сталася помилка під час видалення."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              aria-label="Назад до адмінпанелі"
              className="rounded-xl border border-[#E5DED4] bg-white p-3 transition hover:bg-[#F1EBE2]"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Категорії товарів
              </h1>
              <p className="mt-1 text-sm text-[#85766A]">
                Керуйте категоріями та підкатегоріями каталогу
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadCategories()}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-[#E5DED4] bg-white px-4 py-3 text-sm font-medium transition hover:bg-[#F1EBE2] disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Оновити
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <XCircle size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">{error}</div>
            <button
              type="button"
              onClick={() => void loadCategories()}
              className="font-semibold underline"
            >
              Повторити
            </button>
          </div>
        )}

        {formMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <CheckCircle2 size={19} />
            <span className="flex-1">{formMessage}</span>
            <button
              type="button"
              aria-label="Закрити повідомлення"
              onClick={() => setFormMessage("")}
              className="rounded-lg p-1 hover:bg-green-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E5DED4] bg-white p-5">
            <p className="text-sm text-[#85766A]">Головні категорії</p>
            <p className="mt-2 text-3xl font-bold">{mainCategories.length}</p>
          </div>

          <div className="rounded-2xl border border-[#E5DED4] bg-white p-5">
            <p className="text-sm text-[#85766A]">Підкатегорії</p>
            <p className="mt-2 text-3xl font-bold">
              {categories.filter((item) => item.parent_id !== null).length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5DED4] bg-white p-5">
            <p className="text-sm text-[#85766A]">Активні категорії</p>
            <p className="mt-2 text-3xl font-bold">
              {categories.filter((item) => item.is_active).length}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Структура каталогу</h2>
            <p className="mt-1 text-sm text-[#85766A]">
              Натисніть на категорію, щоб побачити її підкатегорії.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm((current) => !current);
              setFormError("");
              setFormMessage("");
            }}
            className="flex items-center gap-2 rounded-xl bg-[#66852A] px-4 py-3 font-semibold text-white transition hover:bg-[#587522]"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Скасувати" : "Додати категорію"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreateCategory}
            className="mb-6 rounded-2xl border border-[#E5DED4] bg-white p-5 sm:p-6"
          >
            <h3 className="mb-5 text-lg font-bold">Нова категорія</h3>

            {formError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="parentCategory"
                  className="mb-2 block text-sm font-medium"
                >
                  Тип категорії
                </label>

                <select
                  id="parentCategory"
                  value={parentId}
                  onChange={(event) => setParentId(event.target.value)}
                  className="w-full rounded-xl border border-[#DDD3C7] bg-white px-4 py-3 outline-none focus:border-[#66852A]"
                >
                  <option value="">Головна категорія</option>
                  {mainCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      Підкатегорія для: {category.title}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-[#85766A]">
                  Оберіть головну категорію, якщо створюєте підкатегорію.
                </p>
              </div>

              <div>
                <label
                  htmlFor="categoryTitle"
                  className="mb-2 block text-sm font-medium"
                >
                  Назва категорії
                </label>

                <input
                  id="categoryTitle"
                  type="text"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Наприклад, Лежанки для собак"
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-[#DDD3C7] bg-white px-4 py-3 outline-none focus:border-[#66852A]"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-[#4A3528] px-5 py-3 font-semibold text-white transition hover:bg-[#624735] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Збереження..." : "Зберегти категорію"}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-hidden rounded-2xl border border-[#E5DED4] bg-white">
          <div className="flex items-center gap-3 border-b border-[#EEE8DF] bg-[#FBF9F5] px-5 py-4">
            <FolderTree size={20} className="text-[#66852A]" />
            <span className="font-semibold">Категорії та підкатегорії</span>
            <span className="ml-auto rounded-full bg-[#EDE7DD] px-3 py-1 text-xs font-semibold">
              {categories.length}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-sm text-[#85766A]">
              <RefreshCw size={20} className="animate-spin" />
              Завантаження категорій...
            </div>
          ) : mainCategories.length === 0 ? (
            <div className="p-10 text-center">
              <FolderTree size={36} className="mx-auto mb-3 text-[#B7AA9B]" />
              <p className="font-semibold">Категорій поки немає</p>
              <p className="mt-1 text-sm text-[#85766A]">
                Додайте першу категорію за допомогою кнопки вище.
              </p>
            </div>
          ) : (
            <div>
              {mainCategories.map((category) => {
                const children = getSubcategories(category.id);
                const isExpanded = expanded.includes(category.id);

                return (
                  <div
                    key={category.id}
                    className="border-b border-[#EEE8DF] last:border-b-0"
                  >
                    <div className="flex items-center gap-2 px-3 sm:px-5">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        aria-expanded={isExpanded}
                        className="flex min-w-0 flex-1 items-center gap-3 py-4 text-left transition hover:bg-[#FBF9F5]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EBE2] text-[#4A3528]">
                          <FolderTree size={20} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold">
                            {category.title}
                          </span>
                          <span className="mt-1 block text-xs text-[#85766A]">
                            {children.length}{" "}
                            {children.length === 1
                              ? "підкатегорія"
                              : children.length >= 2 && children.length <= 4
                              ? "підкатегорії"
                              : "підкатегорій"}
                          </span>
                        </span>

                        <span
                          className={`hidden rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex ${
                            category.is_active
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {category.is_active ? "Активна" : "Неактивна"}
                        </span>

                        {isExpanded ? (
                          <ChevronDown
                            size={20}
                            className="shrink-0 text-[#85766A]"
                          />
                        ) : (
                          <ChevronRight
                            size={20}
                            className="shrink-0 text-[#85766A]"
                          />
                        )}
                      </button>

                      <button
                        type="button"
                        title={`Видалити ${category.title}`}
                        aria-label={`Видалити ${category.title}`}
                        disabled={deletingId === category.id}
                        onClick={() => void handleDeleteCategory(category)}
                        className="shrink-0 rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                      >
                        {deletingId === category.id ? (
                          <RefreshCw size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-[#EEE8DF] bg-[#FBF9F5] py-2 pl-5 pr-3 sm:pl-16 sm:pr-4">
                        {children.length === 0 ? (
                          <p className="px-3 py-4 text-sm text-[#85766A]">
                            Підкатегорій поки немає.
                          </p>
                        ) : (
                          children.map((child) => (
                            <div
                              key={child.id}
                              className="flex items-center gap-3 rounded-xl px-3 py-3"
                            >
                              <span className="h-2 w-2 shrink-0 rounded-full bg-[#66852A]" />

                              <span className="min-w-0 flex-1 text-sm font-medium">
                                {child.title}
                              </span>

                              <span
                                className={`hidden rounded-full px-2.5 py-1 text-xs sm:inline-flex ${
                                  child.is_active
                                    ? "bg-green-50 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {child.is_active ? "Активна" : "Неактивна"}
                              </span>

                              <button
                                type="button"
                                title={`Видалити ${child.title}`}
                                aria-label={`Видалити ${child.title}`}
                                disabled={deletingId === child.id}
                                onClick={() => void handleDeleteCategory(child)}
                                className="shrink-0 rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                              >
                                {deletingId === child.id ? (
                                  <RefreshCw
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
