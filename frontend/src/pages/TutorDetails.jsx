// frontend/src/pages/TutorDetails.jsx
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function TutorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Берём данные из state (если переданы через Link)
  const [tutor, setTutor] = useState(location.state?.tutor || null);
  const [loading, setLoading] = useState(!location.state?.tutor);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Если данные уже есть — ничего не делаем
    if (tutor) {
      setLoading(false);
      return;
    }

    // 🔹 Прямой запрос — никаких переменных, только строка
    const load = async () => {
      try {
        const res = await fetch('/api/tutors');
        const data = await res.json();
        
        // 🔹 Ищем по id, сравнивая как строки (универсально)
        const found = data.find(t => String(t.id) === String(id));
        
        if (found) {
          setTutor(found);
        } else {
          setError('Репетитор не найден');
        }
      } catch (e) {
        setError('Ошибка: ' + e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, tutor]);

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;

  if (error || !tutor) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <p className="text-red-600 mb-4">{error || 'Репетитор не найден'}</p>
        <button onClick={() => navigate('/tutors')} className="text-blue-600 underline">
          ← Назад
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <button onClick={() => navigate('/tutors')} className="mb-4 text-blue-600 underline">← Назад</button>
      <h1 className="text-2xl font-bold mb-2">{tutor.user?.name || tutor.name || 'Репетитор'}</h1>
      <p className="text-gray-600 mb-4">{tutor.subjects}</p>
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>Опыт: <b>{tutor.experience || '—'}</b></div>
        <div>Цена: <b>{tutor.pricePerHour || '—'} ₽/час</b></div>
        <div>Формат: <b>{tutor.formats || '—'}</b></div>
        <div>Рейтинг: <b>{tutor.rating || 'Новичок'}</b></div>
      </div>
      <p className="text-gray-700 mb-6">{tutor.bio || 'Нет описания'}</p>
      <button className="w-full bg-blue-600 text-white py-3 rounded font-semibold">Записаться</button>
    </div>
  );
}