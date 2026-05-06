// frontend/api/tutors.js
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  // 🔹 Тестовые данные (чтобы убедиться, что роутинг работает)
  const mockData = [
    { id: 1, userId: 1, name: "Анна Иванова", subjects: "Математика", bio: "Подготовка к ЕГЭ", experience: 5, pricePerHour: 1500, formats: "Онлайн", rating: 4.8 }
  ];

  // ⚠️ Позже заменим на реальный запрос к Prisma. Сейчас проверяем, что Vercel отдаёт JSON.
  res.status(200).json(mockData);
}