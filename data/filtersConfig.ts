export type FilterOption = {
  id: string;
  label: string;
};

export type FilterGroup = {
  key: string;
  title: string;
  options: FilterOption[];
};

export const filterFieldLabels: Record<string, string> = {
  brand: "Бренд",
  age: "Вік тварини",
  animalSize: "Розмір тварини",
  animalWeight: "Для ваги тварини",
  foodType: "Тип корму",
  flavor: "Смак / основний білок",
  weight: "Вага упаковки",
  purpose: "Призначення",
  specialNeeds: "Особливі потреби",
  clothingSize: "Розмір одягу",
  color: "Колір",
  material: "Матеріал",
  animalSpecies: "Вид тварини",
  productSize: "Розмір товару",
  volume: "Об'єм",
};

export function getFilterTitle(key: string): string {
  return filterFieldLabels[key] ?? key;
}
