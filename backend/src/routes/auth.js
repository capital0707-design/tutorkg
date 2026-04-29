const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../lib/prisma.cjs');

router.post('/register', async (req, res) => {
  try {
    const { email, password, role, name, phone, adminCode } = req.body;
    if (role === 'ADMIN' && adminCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({ error: 'Неверный код' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email занят' });
    
    const hash = await bcrypt.hash(password, 10);
    const userData = { email, passwordHash: hash, role: role || 'STUDENT', name, phone };
    
    // ✅ data: вынесено в переменную. Ошибка копирования невозможна.
    const user = await prisma.user.create({ data: userData });
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: { id: user.id, email, role: user.role, name }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Неверные данные' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, email, role: user.role, name: user.name }, token });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Требуется токен' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id }, 
      select: { id: true, email: true, role: true, name: true, phone: true } 
    });
    if (!user) return res.status(401).json({ error: 'Не найден' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Неверный токен' });
  }
});

module.exports = router;