import Image from "next/image";
import Link from "next/link";

type CategoryCatalogCardProps = {
  title: string;
  description: string;
  image: string;
  href: string;
};

export default function CategoryCatalogCard({
  title,
  description,
  image,
  href,
}: CategoryCatalogCardProps) {
  return (
    <Link
      href={href}
      className="
        group
        relative
        flex
        min-h-[220px]
        overflow-hidden
        rounded-3xl
        bg-[#F1E7D8]
        transition-transform
        duration-300
        hover:-translate-y-1
      "
    >
      {/* Текст картки */}
      <div
        className="
          relative
          z-10
          flex
          w-[55%]
          flex-col
          justify-center
          p-6
          sm:p-8
        "
      >
        <h2
          className="
            font-heading
            text-xl
            font-bold
            text-foreground
            sm:text-2xl
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-2
            max-w-[220px]
            text-sm
            leading-relaxed
            text-muted-foreground
          "
        >
          {description}
        </p>

        <span
          className="
            mt-5
            text-sm
            font-semibold
            text-[#B58A32]
          "
        >
          Переглянути →
        </span>
      </div>

      {/* Картинка тварини / категорії */}
      <div
        className="
          absolute
          right-0
          bottom-0
          h-full
          w-[52%]
        "
      >
        <Image
          src={image}
          alt={title}
          fill
          className="
            object-contain
            object-right-bottom
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />
      </div>
    </Link>
  );
}
