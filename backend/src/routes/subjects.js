const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma.cjs');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, category: true }
    });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка загрузки предметов' });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, category } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Название предмета обязательно' });
    }

    const subjectData = {
      name: name.trim(),
      category: category ? category.trim() : null
    };

    const subject = await prisma.subject.create({ data: subjectData });
    res.status(201).json(subject);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Такой предмет уже существует' });
    }
    console.error(err);
    res.status(500).json({ error: 'Ошибка создания предмета' });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await prisma.subject.update({
      where: { id: parseInt(req.params.id) },
      data: { active: false }
    });
    res.json({ message: 'Предмет скрыт' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

module.exports = router;