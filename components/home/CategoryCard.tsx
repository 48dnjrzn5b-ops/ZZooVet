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
    <Link href={href} className="group block w-full">
      {/* DESKTOP VERSION */}
      <div
        className="
          hidden
          flex-col
          overflow-hidden
          rounded-2xl
border border-[#D1D5DB]
          bg-white
          transition-all duration-300
          group-hover:border-2
          lg:flex
        "
      >
        {/* КАРТИНКА */}
        <div className="relative h-[235px] w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 16vw, 100vw"
            className="
              object-cover
              object-center
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />
        </div>

        {/* ПІДПИС */}
        <div
          className="
            flex
            h-[45px]
            w-full
            items-center
            justify-center
border-t border-[#D1D5DB]
            bg-white
            text-center
            transition-colors
            group-hover:bg-gray-100
          "
        >
          <h3
            className="
              text-[15px]
              font-semibold
              leading-tight
              text-black
            "
          >
            {title}
          </h3>
        </div>
      </div>

      {/* MOBILE VERSION — БЕЗ ЗМІН */}
      <div
        className="
          flex
          w-full
          flex-col
          items-center
          lg:hidden
        "
      >
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
            width={130}
            height={130}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />
        </div>

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
