import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LessonModal from '../components/LessonModal';
import { API_URL } from '../config/api';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { window.location.href = '/login'; return; }
    setUser(JSON.parse(stored));

    // В продакшене здесь будет запрос с фильтром по email/userId: /api/bookings?studentEmail=...
    fetch(`${API_URL}/bookings`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        const confirmed = Array.isArray(data) ? data.filter(b => b.status === 'CONFIRMED') : [];
        setBookings(confirmed);
        setLoading(false);
      })
      .catch(() => { setError('Ошибка загрузки расписания'); setLoading(false); });
  }, []);

  const handleJoin = (booking) => {
    setActiveLesson({
      id: booking.id,
      tutorName: booking.tutor?.user?.name || 'Репетитор',
      studentName: booking.studentName || user?.name || 'Ученик'
    });
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Загрузка расписания...</div>;
  if (error) return <div className="text-center py-20 text-red-500 bg-white rounded-xl shadow max-w-md mx-auto mt-10 p-6">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Личный кабинет</h1>
        <Link to="/" className="text-sm text-blue-600 hover:underline">← На главную</Link>
      </div>

      {user && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
            {user.name?.[0] || '👤'}
          </div>
          <div>
            <p className="text-gray-800 font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">Статус: <span className="text-blue-600 font-medium">
  {user.role === 'TUTOR' ? 'Репетитор' : user.role === 'ADMIN' ? 'Админ' : 'Ученик'}
</span></p>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-700 mb-4">📅 Мои подтверждённые уроки</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg mb-2">У вас пока нет подтверждённых уроков</p>
          <p className="text-gray-400 text-sm mb-4">Найдите репетитора и запишитесь на занятие</p>
          <Link to="/tutors" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Найти репетитора</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.id} className="bg-white p-5 rounded-xl shadow border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🎓</span>
                  <h3 className="text-lg font-bold text-gray-800">{b.tutor?.user?.name || 'Репетитор'}</h3>
                </div>
                <p className="text-sm text-gray-600">📅 {b.date} в ⏰ {b.time}</p>
                {b.message && <p className="text-xs text-gray-400 mt-1">💬 {b.message}</p>}
              </div>
              <button
                onClick={() => handleJoin(b)}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-sm whitespace-nowrap"
              >
                📹 Присоединиться к уроку
              </button>
            </div>
          ))}
        </div>
      )}

      <LessonModal
        isOpen={!!activeLesson}
        onClose={() => setActiveLesson(null)}
        bookingId={activeLesson?.id}
        tutorName={activeLesson?.tutorName}
        studentName={activeLesson?.studentName}
      />
    </div>
  );
};

export default StudentDashboard;