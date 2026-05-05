// frontend/src/pages/TutorDetails.jsx
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function TutorDetails() {
console.log('🔥 TUTORDetails v2 LOADED - NO FETCH VERSION');
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🔹 Берём данные ТОЛЬКО из state (никаких fetch!)
  const tutor = location.state?.tutor;

  // 🔹 Если данных нет — показываем понятное сообщение
  if (!tutor) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow text-center max-w-md">
          <p className="text-gray-600 mb-4">
            Данные репетитора не загружены.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Пожалуйста, перейдите на эту страницу из каталога репетиторов.
          </p>
          <button
            onClick={() => navigate('/tutors')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            ← Вернуться к каталогу
          </button>
        </div>
      </div>
    );
  }

  // 🔹 Если данные есть — рендерим карточку
  return (
    <div className="min-h-screen bg-green-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/tutors')}
          className="mb-6 text-blue-600 hover:underline flex items-center gap-2"
        >
          ← Назад к каталогу
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-2">{tutor.user?.name || 'Репетитор'}</h1>
          <p className="text-gray-600 mb-4">{tutor.subjects}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Опыт</p>
              <p className="font-semibold">{tutor.experience || '—'} лет</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Цена</p>
              <p className="font-semibold">{tutor.pricePerHour || '—'} ₽/час</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Формат</p>
              <p className="font-semibold">{tutor.formats || '—'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Рейтинг</p>
              <p className="font-semibold">{tutor.rating ? `${tutor.rating} ⭐` : 'Новичок'}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">О себе</p>
            <p className="text-gray-700 whitespace-pre-line">{tutor.bio || 'Нет описания'}</p>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Записаться на занятие
          </button>
        </div>
      </div>
    </div>
  );
}