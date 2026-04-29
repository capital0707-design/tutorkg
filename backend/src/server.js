require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { prisma } = require('./lib/prisma.cjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Socket.io (чистый, без ошибок)
io.on('connection', (socket) => {
  console.log('🔌 Подключился:', socket.id);
  socket.on('disconnect', () => console.log('🔌 Отключился:', socket.id));
});

// ВРЕМЕННО ОТКЛЮЧАЕМ ВСЕ РОУТЫ. Проверим запуск ядра.
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tutors', require('./routes/tutors'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/bookings', require('./routes/bookings'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ СЕРВЕР ЗАПУЩЕН НА ПОРТУ :${PORT}`));