const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// 📚 Предметы
const subjects = [
  { name: 'Математика', category: 'school' },
  { name: 'Русский язык', category: 'school' },
  { name: 'Физика', category: 'school' },
  { name: 'Английский язык', category: 'languages' },
  { name: 'Кыргызский язык', category: 'languages' },
  { name: 'Программирование', category: 'creative' },
];

// 👨‍🏫 Тестовые репетиторы
const testTutors = [
  {
    email: 'anna@example.com',
    name: 'Анна Петрова',
    password: 'password123',
    bio: 'Опытный преподаватель математики и физики. Подготовка к ЕНТ, ОГЭ, олимпиадам.',
    experience: 10,
    subjects: 'Математика,Физика',
    formats: 'online,offline',
    pricePerHour: 800,
    rating: 4.9,
    reviewCount: 15,
    isVerified: true
  },
  {
    email: 'elena@example.com',
    name: 'Елена Ким',
    password: 'password123',
    bio: 'Репетитор английского языка. Разговорная практика, IELTS, бизнес-английский.',
    experience: 7,
    subjects: 'Английский язык',
    formats: 'online',
    pricePerHour: 600,
    rating: 4.7,
    reviewCount: 23,
    isVerified: true
  },
  {
    email: 'marat@example.com',
    name: 'Марат Токтоналиев',
    password: 'password123',
    bio: 'Программирование для школьников и взрослых. Python, веб-разработка, логика.',
    experience: 5,
    subjects: 'Программирование',
    formats: 'online,offline',
    pricePerHour: 700,
    rating: 4.8,
    reviewCount: 8,
    isVerified: true
  }
];

async function main() {
  console.log('🌱 Запуск сидов...');

  // 1. Предметы
  for (const s of subjects) {
    await prisma.subject.upsert({
      where: { name: s.name },
      update: {},
      create: s  // ← ✅ ИСПРАВЛЕНО: было просто "s", стало "create: s"
    });
  }
  console.log('✅ Предметы загружены');

  // 2. Админ
  const adminEmail = 'admin@tutor.kg';
  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminExists) {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({ 
      data: { email: adminEmail, passwordHash: hash, role: 'ADMIN', name: 'Администратор' } 
    });
    console.log('✅ Админ создан');
  }

  // 3. Репетиторы
  for (const t of testTutors) {
    const exists = await prisma.user.findUnique({ where: { email: t.email } });
    if (!exists) {
      const hash = await bcrypt.hash(t.password, 10);
      
      const userData = { email: t.email, passwordHash: hash, role: 'TUTOR', name: t.name };
      const user = await prisma.user.create({ data: userData });

      const profileData = {
        userId: user.id,
        bio: t.bio,
        experience: t.experience,
        subjects: t.subjects,
        formats: t.formats,
        pricePerHour: t.pricePerHour,
        rating: t.rating,
        reviewCount: t.reviewCount,
        isVerified: t.isVerified
      };
      await prisma.tutorProfile.create({ data: profileData });
      
      console.log(`✅ Репетитор создан: ${t.name}`);
    }
  }

  console.log('🎉 Готово!');
}

main()
  .catch(e => { console.error('❌ Ошибка:', e.message); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });