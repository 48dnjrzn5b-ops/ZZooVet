import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  title: string;
  image: string;
  href: string;
};

export default function CategoryCard({
  title,
  image,
  href,
}: CategoryCardProps) {
  return (
    <Link href={href} className="group block">
      {/* ================================================= */}
      {/* DESKTOP VERSION */}
      {/* ================================================= */}

      <div
        className="
    relative
    hidden
    h-[240px]
    w-full
    overflow-hidden
    rounded-2xl
    bg-[#F1E7D8]
    lg:block
  "
      >
        {/* КАРТИНКА */}
        <div
          className="
      absolute
      bottom-0
      left-0
      h-full
      w-[55%]
    "
        >
          <Image
            src={image}
            alt={title}
            fill
            className={`
        object-contain
        object-bottom
        transition-transform
        duration-300
        group-hover:scale-105

        ${
          title === "Гризунам"
            ? "scale-[1.25] origin-bottom"
            : "scale-[1.45] origin-bottom"
        }
      `}
          />
        </div>

        {/* ТЕКСТ */}
        <div
          className="
      absolute
      right-[9%]
      top-1/2
      -translate-y-1/2
    "
        >
          <h3
            className="
        max-w-[180px]
        text-[clamp(1rem,1.5vw,1.5rem)]
        font-semibold
        leading-tight
      "
          >
            {title}
          </h3>

          <span
            className="
        mt-4
        block
        text-[clamp(0.75rem,1.2vw,0.9rem)]
      "
          >
            Переглянути →
          </span>
        </div>
      </div>

      {/* ================================================= */}
      {/* MOBILE VERSION */}
      {/* ================================================= */}

      <div
        className="
          flex
          w-[90px]
          flex-col
          items-center
          lg:hidden
        "
      >
        {/* Кругла область картинки */}
        <div
          className="
            flex
            h-[76px]
            w-[76px]
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-[#F8E3C9]
          "
        >
          <Image
            src={image}
            alt={title}
            width={120}
            height={120}
            className="
              h-full
              w-full
              object-contain
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />
        </div>

        {/* Назва */}
        <span
          className="
            mt-2
            text-center
            text-sm
            font-medium
            leading-tight
          "
        >
          {title}
        </span>
      </div>
    </Link>
  );
}
