// frontend/scripts/add-test-tutors.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем добавление тестовых репетиторов...');

  // 🔹 Простой хэш для тестов (в реальном проекте используй bcrypt!)
  const hashPassword = (pwd) => `hashed_${pwd}_salt_xyz`;

  const tutors = [
    {
      user: { 
        create: { 
          email: 'anna@test.com', 
          passwordHash: hashPassword('temp123'),
          name: 'Анна Петрова',
          role: 'TUTOR' // 🔹 Важно: роль репетитора
        } 
      },
      subjects: 'Математика, Алгебра, Геометрия', // 🔹 Вместо category
      formats: 'Онлайн, Очно',
      pricePerHour: 1500,
      experience: 5,
      bio: 'Подготовка к ЕГЭ и ОГЭ. Индивидуальный подход.'
    },
    {
      user: { 
        create: { 
          email: 'ivan@test.com', 
          passwordHash: hashPassword('temp123'),
          name: 'Иван Сидоров',
          role: 'TUTOR'
        } 
      },
      subjects: 'Английский язык, IELTS, Разговорный',
      formats: 'Онлайн',
      pricePerHour: 1800,
      experience: 8,
      bio: 'Разговорный английский, подготовка к международным экзаменам.'
    },
    {
      user: { 
        create: { 
          email: 'maria@test.com', 
          passwordHash: hashPassword('temp123'),
          name: 'Мария Ким',
          role: 'TUTOR'
        } 
      },
      subjects: 'Физика, Механика, Электричество',
      formats: 'Онлайн, Очно',
      pricePerHour: 1600,
      experience: 3,
      bio: 'Понятное объяснение сложных тем. Помощь с лабораторными работами.'
    }
  ];

  for (const t of tutors) {
    await prisma.tutorProfile.create({ data: t });
  }

  console.log('✅ Готово! Добавлено 3 репетитора.');
}

main()
  .catch(e => console.error('❌ Ошибка:', e.message || e))
  .finally(() => prisma.$disconnect());