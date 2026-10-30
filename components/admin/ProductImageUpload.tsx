"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

type ProductImageUploadProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ProductImageUpload({
  label,
  value,
  onChange,
}: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Оберіть зображення JPG, PNG або WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Максимальний розмір зображення — 5 МБ.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();

      const extension =
        file.type === "image/jpeg"
          ? "jpg"
          : file.type === "image/png"
          ? "png"
          : "webp";

      const path = `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

      onChange(data.publicUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не вдалося завантажити зображення."
      );
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <label className="mb-3 block text-sm font-medium text-gray-700">
        {label}
      </label>

      {value && (
        <div className="mb-4">
          <Image
            src={value}
            alt={label}
            width={600}
            height={400}
            className="h-40 w-full rounded-lg bg-gray-50 object-contain"
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#66852A] file:px-4 file:py-2 file:text-white hover:file:bg-[#587522] disabled:opacity-50"
      />

      {uploading && (
        <p className="mt-2 text-sm text-gray-500">Завантаження фотографії...</p>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-3 text-sm text-red-600 hover:underline"
        >
          Прибрати з товару
        </button>
      )}
    </div>
  );
}
