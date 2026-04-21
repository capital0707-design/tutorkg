export const myData = [
  {
    id: "1",
    full_name: "Петр Николаевич Корнилов",
    price_per_hour: 700,
    experience_years: 5,
    district: "Октябрьский",
    is_online: true,
    is_home: true,
    is_verified: true,
    bio: "Опытный преподаватель математики и физики. Подготовка к ОРТ и экзаменам.",
    photo_url: null, // или ссылка на фото
    subjects: [
      { id: "sub1", name: "Математика" },
      { id: "sub2", name: "Физика" }
    ]
  },
  {
    id: "2",
    full_name: "Давлетова Айнура Акматовна",
    price_per_hour: 450,
    experience_years: 3,
    district: "Первомайский",
    is_online: true,
    is_home: false,
    is_verified: false,
    bio: "Репетитор начальных классов и кыргызского языка. Индивидуальный подход к каждому ребенку.",
    photo_url: null,
    subjects: [
      { id: "sub3", name: "Кыргызский язык" },
      { id: "sub4", name: "Начальная школа" }
    ]
  }
];

export const categories = [
  { id: '1', name: 'Языки', sort_order: 1 },
  { id: '2', name: 'Точные науки', sort_order: 2 }
];

export const subjects = [
  { id: 'sub1', category_id: '2', name: 'Математика', sort_order: 1 },
  { id: 'sub2', category_id: '2', name: 'Физика', sort_order: 2 },
  { id: 'sub3', category_id: '1', name: 'Кыргызский язык', sort_order: 1 },
  { id: 'sub4', category_id: '1', name: 'Русский язык', sort_order: 2 }
];
