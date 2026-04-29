const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma.cjs');

// ✅ GET /api/bookings — Получить все заявки с данными репетитора
router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        tutor: { include: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (err) {
    console.error('Bookings fetch error:', err);
    res.status(500).json({ error: 'Ошибка загрузки заявок' });
  }
});

// ✅ POST /api/bookings — Создать заявку (уже работало)
router.post('/', async (req, res) => {
  try {
    const { tutorId, studentName, phone, date, time, message } = req.body;
    if (!tutorId || !studentName || !phone || !date || !time) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    const booking = await prisma.booking.create({
      data: {
        tutorId: parseInt(tutorId),
        studentName, phone, date, time,
        message: message || ''
      }
    });
    res.status(201).json({ success: true, message: 'Заявка сохранена', bookingId: booking.id });
  } catch (err) {
    console.error('Booking create error:', err);
    res.status(500).json({ error: 'Ошибка сохранения заявки' });
  }
});

// ✅ PATCH /api/bookings/:id — Обновить статус
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['PENDING', 'CONFIRMED', 'CANCELLED'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Недопустимый статус' });

    const updated = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(updated);
  } catch (err) {
    console.error('Booking update error:', err);
    res.status(500).json({ error: 'Ошибка обновления статуса' });
  }
});

module.exports = router;