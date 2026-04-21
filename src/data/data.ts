import { Item } from './types'; // Убедись, что путь к файлу с интерфейсом верный

export const myData: Item[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    name: "Петр Николаевич Корнилов",
    language: "Русский", // Добавь язык, если нужно
    price: 700,
    contact: "@peter_kornilov",
    photo: "https://placeholder.com" // Заглушка для фото
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    name: "Давлетова Айнура Акматовна",
    language: "Кыргызский",
    price: 450,
    contact: "@ainura_davletova",
    photo: "https://placeholder.com"
  }
];
