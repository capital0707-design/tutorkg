const jwt = require('jsonwebtoken');
const { prisma } = require('../lib/prisma.cjs');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    
    if (!user) return res.status(401).json({ error: 'Пользователь не найден' });
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Неверный токен' });
  }
};

const admin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Доступ только для администратора' });
  }
  next();
};

module.exports = { protect, admin };