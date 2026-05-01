import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import { API_URL } from '../config/api';

const TutorProfile = () => {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/tutors/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Репетитор не найден');
        return res.json();
      })
      .then(data => { setTutor(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-500">Загрузка профиля...</div>;
  if (error) return (
    <div className="text-center py-20 bg-white rounded-xl shadow max-w-md mx-auto mt-10">
      <p className="text-red-500 mb-4 text-lg">{error}</p>
      <Link to="/" className="text-blue-600 hover:underline font-medium">← На главную</Link>
    </div>
  );

  const subjectsArr = tutor.subjects ? tutor.subjects.split(',').map(s => s.trim()).filter(Boolean) : [];
  const formatsArr = tutor.formats ? tutor.formats.split(',').map(f => f.trim()).filter(Boolean) : [];

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-8 rounded-xl shadow-lg">
      <div className="flex items-start gap-6 mb-6 border-b pb-6">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 shrink-0">
          {tutor.user?.name?.[0] || '👤'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tutor.user?.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-medium">⭐ {tutor.rating || '5.0'}</span>
            <span>{tutor.reviewCount || 0} отзывов</span>
            <span>🎓 {tutor.experience} лет опыта</span>
            {tutor.isVerified && <span className="text-green-600">✅ Проверен</span>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">О репетиторе</h3>
          <p className="text-gray-600 leading-relaxed">{tutor.bio || 'Информация не указана'}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">📚 Предметы</h4>
            <div className="flex flex-wrap gap-2">
              {subjectsArr.length > 0 ? subjectsArr.map((sub, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{sub}</span>
              )) : <span className="text-gray-400 text-sm">Не указаны</span>}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">📍 Формат занятий</h4>
            <div className="flex gap-3 text-sm font-medium">
              {formatsArr.includes('online') && <span className="text-blue-600">🖥️ Онлайн</span>}
              {formatsArr.includes('offline') && <span className="text-green-600">🏫 Офлайн</span>}
              {formatsArr.length === 0 && <span className="text-gray-400">Не указан</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          <div>
            <span className="text-sm text-gray-500 block">Стоимость занятия</span>
            <span className="text-2xl font-bold text-green-600">{tutor.pricePerHour} сом/час</span>
          </div>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md active:scale-[0.98]"
          >
            Записаться
          </button>
        </div>
      </div>

      <Link to="/" className="inline-block mt-6 text-blue-600 hover:underline font-medium">← Вернуться к поиску</Link>

      {/* 📦 Модальное окно бронирования */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} tutor={tutor} />
    </div>
  );
};

export default TutorProfile;