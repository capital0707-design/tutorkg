// api/tutors/index.js
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// 🔹 GET /api/tutors — список репетиторов
export async function GET(request) {
  try {
    const tutors = await prisma.tutorProfile.findMany({
      where: { isApproved: true },
      include: { user: { select: { name: true, email: true } } }
    });
    return new Response(JSON.stringify(tutors), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Ошибка загрузки' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 🔹 POST /api/tutors — создать (только админ)
export async function POST(request) {
  try {
    // Проверка токена (упрощённо)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Нет токена' }), { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Доступ запрещён' }), { status: 403 });
    }

    const body = await request.json();
    const tutor = await prisma.tutorProfile.create({
       {
        userId: body.userId,
        subjects: body.subjects,
        pricePerHour: body.pricePerHour,
        // ... остальные поля
      },
      include: { user: true }
    });
    return new Response(JSON.stringify(tutor), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Ошибка создания' }), { status: 500 });
  }
}