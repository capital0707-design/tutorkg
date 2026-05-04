// frontend/scripts/verify-db.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Проверка подключения к базе...\n');

  // Показываем, к какой базе подключаемся (маскируем пароль)
  const dbUrl = process.env.DATABASE_URL || 'не задана';
  const masked = dbUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
  console.log('DATABASE_URL:', masked);

  // Считаем записи в TutorProfile
  const count = await prisma.tutorProfile.count();
  console.log('\n📊 Записей в TutorProfile:', count);

  // Если 0 — пробуем добавить одного тестового репетитора ПРЯМО СЕЙЧАС
  if (count === 0) {
    console.log('\n🌱 Добавляем одного тестового репетитора...');
    try {
      const tutor = await prisma.tutorProfile.create({
        data: {
          user: { create: { name: 'Тест Репетитор', email: 'test@tutorkg.com', password: 'temp123' } },
          category: 'Тестовая категория',
          pricePerHour: 1000,
          experience: 1,
          bio: 'Тестовая запись для проверки подключения'
        }
      });
      console.log('✅ Создан репетитор с ID:', tutor.id);
    } catch (e) {
      console.log('❌ Ошибка при создании:', e.message);
    }
  }

  // Показываем все записи после попытки добавления
  const tutors = await prisma.tutorProfile.findMany({ include: { user: true } });
  console.log('\n📋 Все репетиторы в базе:', tutors.length);
  tutors.forEach(t => {
    console.log(` - ${t.user?.name} | ${t.category} | $${t.pricePerHour}/час`);
  });
}

main()
  .catch(e => console.error('💥 Fatal:', e))
  .finally(() => prisma.$disconnect());