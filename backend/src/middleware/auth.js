// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

// 🔹 СТАРАЯ ФУНКЦИЯ (если она называлась иначе, замени `protect` на своё имя)
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Нет токена' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Невалидный токен' });
  }
};

// 🔹 НОВЫЕ ФУНКЦИИ ДЛЯ АДМИНКИ
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Доступ запрещён' });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: err.name === 'TokenExpiredError' ? 'Сессия истекла' : 'Невалидный токен' });
  }
};

const verifyAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Невалидный токен' });
  }
};

// 🔑 ЭКСПОРТ ВСЕХ ФУНКЦИЙ В ОДНОМ ОБЪЕКТЕ
module.exports = { protect, verifyAdmin, verifyAuth };