// frontend/api/masters.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id, category, district } = req.query || {};

  // 🔹 Запрос одного мастера по ID
  if (id) {
    const master = await prisma.master.findUnique({
      where: { id: parseInt(id) },
      include: { user: { select: { name: true, email: true } } }
    });
    return res.status(200).json(master || { error: 'Мастер не найден' });
  }

  // 🔹 Запрос списка с фильтрами
  const where = {};
  if (category) where.category = category;
  if (district) where.district = district;

  const masters = await prisma.master.findMany({
    where,
    orderBy: { rating: 'desc' },
    select: { 
      id: true, name: true, category: true, skills: true, 
      district: true, rating: true, phone: true 
    }
  });

  res.status(200).json(masters);
}