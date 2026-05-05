// frontend/src/pages/TutorDetails.jsx
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// 🔹 ЖЁСТКИЙ АДРЕС (обходим все проблемы с .env и Vite)
const API_BASE = 'https://tutorkg.vercel.app/api';

export default function TutorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tutor, setTutor] = useState(location.state?.tutor || null);
  const [loading, setLoading] = useState(!location.state?.tutor);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tutor) { setLoading(false); return; }

    const fetchTutor = async () => {
      try {
        console.log('📡 Fetch:', `${API_BASE}/tutors`);
        const res = await fetch(`${API_BASE}/tutors`);

        // 🔒 ЗАЩИТА: если сервер вернул HTML (404/ошибка Vercel), не ломаем JSON.parse
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          const preview = await res.text();
          throw new Error(`API вернул HTML. Начало ответа: ${preview.slice(0, 100)}`);
        }

        const data = await res.json();
        const found = data.find(t => String(t.id) === String(id));
        if (!found) throw new Error('Репетитор не найден в базе');
        
        setTutor(found);
      } catch (err) {
        console.error('❌ TutorDetails:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [id, tutor]);

  if (loading) return <div className="p-8 text-center text-gray-600">Загрузка...</div>;
  
  if (error || !tutor) {
    return (
      <div className="p-8 max-w-md mx-auto text-center bg-white rounded-xl shadow mt-12">
        <p className="text-red-600 font-semibold mb-2">⚠️ Ошибка загрузки</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button onClick={() => navigate('/tutors')} className="text-blue-600 underline">
          ← Вернуться к каталогу
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <button onClick={() => navigate('/tutors')} className="mb-4 text-blue-600 underline">← Назад</button>
      <h1 className="text-2xl font-bold mb-2">{tutor.user?.name || 'Репетитор'}</h1>
      <p className="text-gray-600 mb-4">{tutor.subjects}</p>
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>Опыт: <b>{tutor.experience || '—'} лет</b></div>
        <div>Цена: <b>{tutor.pricePerHour || '—'} ₽/час</b></div>
        <div>Формат: <b>{tutor.formats || '—'}</b></div>
        <div>Рейтинг: <b>{tutor.rating || 'Новичок'}</b></div>
      </div>
      <p className="text-gray-700 mb-6">{tutor.bio || 'Нет описания'}</p>
      <button className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition">
        Записаться на занятие
      </button>
    </div>
  );
}