const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma.cjs');
const { protect } = require('../middleware/auth');

// POST: Создать заявку
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ error: 'Только студенты могут создавать заявки' });
    }
    const { tutorId, subject, format, budget, preferredTime } = req.body;

    const requestData = {
      studentId: req.user.id,
      tutorId: tutorId ? parseInt(tutorId) : null,
      subject: subject,
      format: format,
      budget: budget ? parseFloat(budget) : null,
      preferredTime: preferredTime,
      status: 'PENDING'
    };

    const request = await prisma.request.create({ data: requestData });
    res.status(201).json(request);
  } catch (err) {
    console.error('Create request error:', err);
    res.status(500).json({ error: 'Ошибка создания заявки' });
  }
});

// GET: Мои заявки
router.get('/my', protect, async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      where: { studentId: req.user.id },
      include: { tutor: { include: { user: { select: { name: true, avatar: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка загрузки заявок' });
  }
});

// PATCH: Обновить статус
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: 'Неверный статус' });
    }

    const request = await prisma.request.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!request) return res.status(404).json({ error: 'Заявка не найдена' });

    if (req.user.role !== 'ADMIN' && request.tutorId && req.user.id !== request.tutorId) {
      return res.status(403).json({ error: 'Нет прав' });
    }

    const updateData = { status };
    const updated = await prisma.request.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления статуса' });
  }
});

module.exports = router;