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
      {/* ================================================= */}
      {/* DESKTOP VERSION */}
      {/* ================================================= */}

      <div
        className="
          hidden
          flex-col
          overflow-hidden
          rounded-2xl
          bg-[#F1E7D8]
          lg:flex
        "
      >
        {/* КАРТИНКА НА ВСЮ КАРТКУ (без відступів, розтягується на всю ширину і висоту) */}
        <div className="relative h-[235px] w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="
              object-cover
              object-center
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />
        </div>

        {/* ПІДПИС ОКРЕМО ЯК КНОПКА ЗНИЗУ */}
        <div
          className="
            flex
            h-[45px]
            w-full
            items-center
            justify-center
            bg-[#E6D5BE]
            text-center
            transition-colors
            group-hover:bg-[#D8C4AB]
          "
        >
          <h3
            className="
              text-[15px]
              font-semibold
              leading-tight
              text-[#202828]
            "
          >
            {title}
          </h3>
        </div>
      </div>

      {/* ================================================= */}
      {/* MOBILE VERSION */}
      {/* ================================================= */}

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
