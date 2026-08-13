// Імпортуємо іконки з lucide-react
import { Truck, RotateCcw, Headphones, ShieldCheck } from "lucide-react";

// Масив усіх переваг
const advantages = [
  {
    // Іконка доставки
    icon: Truck,

    // Заголовок
    title: "Безкоштовна доставка",

    // Опис
    description: "від 1000 грн",
  },

  {
    // Іконка повернення
    icon: RotateCcw,

    title: "Повернення товару",

    description: "протягом 14 днів",
  },

  {
    // Іконка підтримки
    icon: Headphones,

    title: "Підтримка 24/7",

    description: "ми завжди на зв'язку",
  },

  {
    // Іконка безпечної оплати
    icon: ShieldCheck,

    title: "Безпечна оплата",

    description: "онлайн та при отриманні",
  },
];

// Головний компонент
export default function Advantages() {
  return (
    <section
      className="
        px-2
        py-4
        sm:px-2
        lg:px-14
      "
    >
      {/* Контейнер самого блоку */}
      <div
        className="
          mx-auto
          flex
          max-w-7xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-[#D6B36A]/20
          bg-[#F8F3EA]
          sm:flex-row
        "
      >
        {/* Перебираємо всі переваги */}
        {advantages.map((advantage, index) => {
          // Отримуємо компонент іконки
          const Icon = advantage.icon;

          return (
            <div
              key={advantage.title}
              className={`
                flex
                flex-1
                items-center
                gap-4
                px-5
                py-5

                ${
                  index !== advantages.length - 1
                    ? "border-b border-[#D6B36A]/20 sm:border-b-0 sm:border-r"
                    : ""
                }
              `}
            >
              {/* Блок іконки */}
              <div
                className="
                  flex
                  shrink-0
                  items-center
                  justify-center
                "
              >
                <Icon size={38} strokeWidth={1.7} className="text-[#8BA54A]" />
              </div>

              {/* Текст */}
              <div>
                {/* Назва переваги */}
                <h3
                  className="
                    text-sm
                    font-semibold
                    text-foreground
                    sm:text-base
                  "
                >
                  {advantage.title}
                </h3>

                {/* Опис */}
                <p
                  className="
                    mt-1
                    text-xs
                    text-muted-foreground
                    sm:text-sm
                  "
                >
                  {advantage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
