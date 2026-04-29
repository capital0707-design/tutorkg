const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma.cjs');

// GET /api/tutors — список всех (с фильтрами)
router.get('/', async (req, res) => {
  try {
    const { subject, format, maxBudget } = req.query;
    const where = {};

    if (subject && subject !== 'any') where.subjects = { contains: subject };
    if (format && format !== 'any') where.formats = { contains: format };
    if (maxBudget) where.pricePerHour = { lte: parseFloat(maxBudget) };

    const tutors = await prisma.tutorProfile.findMany({
      where,
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { rating: 'desc' }
    });
    res.json(tutors);
  } catch (err) {
    console.error('Tutors list error:', err);
    res.status(500).json({ error: 'Ошибка загрузки' });
  }
});

// ✅ GET /api/tutors/:id — ОДИН репетитор (добавлено!)
router.get('/:id', async (req, res) => {
  try {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: { select: { id: true, name: true, avatar: true } } }
    });
    if (!tutor) return res.status(404).json({ error: 'Репетитор не найден' });
    res.json(tutor);
  } catch (err) {
    console.error('Tutor profile error:', err);
    res.status(500).json({ error: 'Ошибка загрузки профиля' });
  }
});

module.exports = router;