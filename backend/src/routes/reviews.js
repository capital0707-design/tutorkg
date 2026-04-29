const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma.cjs');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { tutorId, rating, comment } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Рейтинг должен быть от 1 до 5' });
    }

    const reviewData = {
      studentId: req.user.id,
      tutorId: parseInt(tutorId),
      rating: parseInt(rating),
      comment: comment || null
    };

    const review = await prisma.review.create({ data: reviewData });

    const stats = await prisma.review.aggregate({
      where: { tutorId: parseInt(tutorId) },
      _avg: { rating: true },
      _count: true
    });

    await prisma.tutorProfile.update({
      where: { id: parseInt(tutorId) },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count || 0
      }
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка создания отзыва' });
  }
});

router.get('/tutor/:tutorId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { tutorId: parseInt(req.params.tutorId) },
      include: { student: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка загрузки отзывов' });
  }
});

module.exports = router;