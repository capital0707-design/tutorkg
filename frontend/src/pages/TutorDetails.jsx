// frontend/src/pages/TutorDetails.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_URL } from '../config/api';

export default function TutorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🔹 В реальном проекте: запрос /api/tutors/:id
    // 🔹 Сейчас: берём из общего списка и фильтруем по ID
    const fetchTutor = async () => {
      try {
        const res = await fetch(`${API_URL}/tutors`);
        if (!res.ok) throw new Error('Ошибка загрузки');
        const data = await res.json();
        const found = data.find(t => t.id === Number(id) || t.id === id);
        setTutor(found || null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;
  if (error || !tutor) return (
    <div className="p-8 text-center">
      <p className="text-red-500 mb-4">Репетитор не найден</p>
      <button onClick={() => navigate('/tutors')} className="text-blue-600 hover:underline">
        ← Назад к каталогу
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => navigate('/tutors')} className="mb-6 text-blue-600 hover:underline">
        ← Назад к каталогу
      </button>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-2">{tutor.user?.name || 'Репетитор'}</h1>
        <p className="text-gray-600 mb-4">{tutor.subjects}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Опыт</p>
            <p className="font-semibold">{tutor.experience} лет</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Цена</p>
            <p className="font-semibold">{tutor.pricePerHour} ₽/час</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Формат</p>
            <p className="font-semibold">{tutor.formats}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Рейтинг</p>
            <p className="font-semibold">{tutor.rating || 'Новичок'}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">О себе</p>
          <p className="text-gray-700">{tutor.bio || 'Нет описания'}</p>
        </div>
        
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Записаться на занятие
        </button>
      </div>
    </div>
  );
}