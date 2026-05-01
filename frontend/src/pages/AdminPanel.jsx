import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LessonModal from '../components/LessonModal';
import { API_URL } from '../config/api';

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    fetch('fetch(`${API_URL}/api/bookings')
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки заявок');
        return res.json();
      })
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Ошибка обновления');
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) { alert(err.message); }
  };

  const handleStartLesson = (booking) => {
    console.log('🟢 Кнопка нажата!', booking);
    setActiveLesson({
      id: booking.id,
      tutorName: booking.tutor?.user?.name || 'Репетитор',
      studentName: booking.studentName || 'Ученик'
    });
  };

  const getStatusStyle = (status) => {
    const s = status?.toUpperCase();
    if (s === 'CONFIRMED') return 'bg-green-100 text-green-800 border-green-200';
    if (s === 'CANCELLED') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  if (loading) return <div className="text-center py-20 text-gray-500 text-lg">Загрузка заявок...</div>;
  if (error) return <div className="text-center py-20 text-red-500 bg-white rounded-xl shadow max-w-md mx-auto mt-10 p-6">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Админ-панель</h1>
        <Link to="/" className="text-sm text-blue-600 hover:underline">← На главную</Link>
      </div>

      {/* 🔍 ОТЛАДКА: показывает, открыта ли модалка */}
      {activeLesson && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
          ✅ Модалка активна: Урок #{activeLesson.id} | {activeLesson.studentName}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg mb-2">Заявок пока нет</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Дата</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Репетитор</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Ученик</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Телефон</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Время</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Сообщение</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Статус</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-800">{b.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{b.tutor?.user?.name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{b.studentName}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{b.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{b.time}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate hidden md:table-cell">{b.message || '—'}</td>
                    <td className="px-4 py-3 text-sm space-y-2">
                      <select
                        value={b.status || 'PENDING'}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`w-full px-2 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(b.status)} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      >
                        <option value="PENDING">⏳ В ожидании</option>
                        <option value="CONFIRMED">✅ Подтверждено</option>
                        <option value="CANCELLED">❌ Отменено</option>
                      </select>
                      
                      {/* ✅ Кнопка урока: появляется только при CONFIRMED */}
                      {b.status?.toUpperCase() === 'CONFIRMED' && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleStartLesson(b); }}
                          className="w-full bg-green-600 text-white py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                        >
                          📹 Провести урок
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default AdminPanel;