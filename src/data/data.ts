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

  export const categories = [
  { id: '1', name: 'Языки', sort_order: 1 },
  { id: '2', name: 'Математика', sort_order: 2 }
];

export const subjects = [
  { id: 'sub1', category_id: '1', name: 'Русский язык', sort_order: 1 },
  { id: 'sub2', category_id: '1', name: 'Кыргызский язык', sort_order: 2 },
  { id: 'sub3', category_id: '2', name: 'Алгебра', sort_order: 1 }
];
];
