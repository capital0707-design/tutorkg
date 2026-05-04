// frontend/scripts/debug-db.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Диагностика базы данных Neon...\n');

  // 1. Проверяем, какие таблицы есть
  const tables = await prisma.$queryRaw`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `;
  console.log('📋 Таблицы в public:', tables.map(t => t.table_name));

  // 2. Пытаемся прочитать TutorProfile (как в коде)
  try {
    const tutors = await prisma.tutorProfile.findMany({ include: { user: true } });
    console.log('\n✅ tutorProfile.findMany() вернул:', tutors.length, 'записей');
    if (tutors.length > 0) {
      console.log('Пример:', JSON.stringify(tutors[0], null, 2));
    }
  } catch (e) {
    console.log('\n❌ Ошибка при чтении tutorProfile:', e.message);
  }

  // 3. Пытаемся прочитать tutorprofile (нижний регистр)
  try {
    const raw = await prisma.$queryRaw`SELECT * FROM "public"."tutorprofile" LIMIT 1`;
    console.log('\n✅ Таблица "tutorprofile" (нижний регистр) существует');
  } catch (e) {
    console.log('\n❌ Таблица "tutorprofile" не найдена:', e.shortMessage || e.message);
  }
}

main()
  .catch(e => console.error('💥 Fatal:', e))
  .finally(() => prisma.$disconnect());