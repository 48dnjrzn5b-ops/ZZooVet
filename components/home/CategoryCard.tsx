// Імпортуємо Image для оптимізованого завантаження картинок
import Image from "next/image";

// Імпортуємо Link для переходу на сторінку категорії
import Link from "next/link";

// Описуємо props нашої картки
type CategoryCardProps = {
  // Назва категорії
  title: string;

  // Шлях до картинки
  image: string;

  // Посилання на сторінку категорії
  href: string;
};

// Створюємо компонент картки
export default function CategoryCard({
  title,
  image,
  href,
}: CategoryCardProps) {
  // Повертаємо посилання-картку
  return (
    <Link
      // Куди переходимо
      href={href}
      // Головний контейнер картки
      className="
        group
        relative
        block
        shrink-0
        overflow-hidden
        rounded-2xl
      "
    >
      {/* ================================================= */}
      {/* DESKTOP VERSION */}
      {/* ================================================= */}
      <div
        className="
    relative
    hidden
    w-full
    overflow-hidden
    rounded-2xl
    bg-[#F1E7D8]
    lg:block
  "
      >
        <Image
          src={image}
          alt={title}
          width={1024}
          height={600}
          className="
    relative
    -left-[18%]
    block
    h-auto
    w-full
    rounded-2xl
    object-contain
    transition-transform
    duration-300
    ease-out
    group-hover:scale-[1.02]
    "
        />
        {/* Текст поверх картинки */}
        <div
          className="
      absolute
      right-[8%]
      top-1/2
      -translate-y-1/2
    "
        >
          <h3
            className="
        text-[clamp(1rem,1.5vw,1.5rem)]
        font-semibold 
        max-w-[100px]
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
        // На mobile показуємо маленьку картку
        // На desktop приховуємо
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
          {/* Картинка */}
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

        {/* Назва категорії */}
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
