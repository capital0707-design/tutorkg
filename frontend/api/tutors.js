// frontend/api/tutors.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не разрешён' });
  }

  try {
    const tutors = await prisma.tutorProfile.findMany({
      include: { user: { select: { name: true, email: true } } }
    });
    res.status(200).json(tutors);
  } catch (err) {
    console.error('Tutors API error:', err);
    res.status(500).json({ error: 'Ошибка загрузки репетиторов' });
  }
}