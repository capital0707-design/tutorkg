// frontend/src/pages/MasterDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function MasterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [master, setMaster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaster = async () => {
      try {
        // 🔹 РЕАЛЬНЫЙ ЗАПРОС К БАЗЕ (Работает на Vercel)
        const res = await fetch(`/api/masters?id=${id}`);
        const data = await res.json();
        
        if (data.error) {
          navigate('/masters');
          return;
        }
        setMaster(data);
        
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaster();
  }, [id, navigate]);

  if (loading) return <div className="p-8 text-center text-gray-500">Загрузка профиля...</div>;
  if (!master) return <div className="p-8 text-center text-red-500">Мастер не найден</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={() => navigate('/masters')} className="mb-6 text-blue-600 hover:underline flex items-center gap-2">
        ← Назад к мастерам
      </button>
      
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 break-words min-w-0">{master.name}</h1>
            <p className="text-gray-500 mt-1">📍 {master.district} район, {master.city || 'Бишкек'}</p>
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
            {master.category}
          </span>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Навыки и услуги:</h3>
          <div className="flex flex-wrap gap-2">
            {master.skills.map((s, i) => (
              <span key={i} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm border border-green-200">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Рейтинг и отзывы</p>
            <p className="font-bold text-lg text-yellow-600">⭐ {master.rating.toFixed(1)} <span className="text-gray-400 font-normal text-sm">({master.reviewsCount} отз.)</span></p>
          </div>
          <a 
            href={`tel:${master.phone}`} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-sm"
          >
            📞 Позвонить
          </a>
        </div>
      </div>
    </div>
  );
}