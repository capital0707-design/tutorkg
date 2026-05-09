// frontend/src/pages/Masters.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, DISTRICTS } from '../config/masters';

export default function Masters() {
  const [masters, setMasters] = useState([]);
  const [filterCat, setFilterCat] = useState('');
  const [filterDist, setFilterDist] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMasters = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterCat) params.append('category', filterCat);
        if (filterDist) params.append('district', filterDist);

        const res = await fetch(`/api/masters?${params.toString()}`);
        const data = await res.json();
        
        // 🔹 Для отладки: открой F12 → Console на Vercel
        console.log('📦 Ответ API:', data);
        
        setMasters(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('❌ Ошибка загрузки:', e);
        setMasters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMasters();
  }, [filterCat, filterDist]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* 🔹 Заголовок с явным тёмным цветом */}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">🔧 Найти мастера в Бишкеке</h1>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="p-2 border rounded text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все категории</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.label} className="text-gray-900">{c.label}</option>
          ))}
        </select>
        <select
          value={filterDist}
          onChange={e => setFilterDist(e.target.value)}
          className="p-2 border rounded text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все районы</option>
          {DISTRICTS.map(d => (
            <option key={d} value={d} className="text-gray-900">{d}</option>
          ))}
        </select>
      </div>

      {/* Состояния загрузки и пустоты */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Загрузка мастеров...</p>
      ) : masters.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Мастеров пока нет. Будьте первым!</p>
      ) : (
        /* Карточки */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masters.map(m => (
            <Link
              key={m.id}
              to={`/masters/${m.id}`}
              className="block bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-100"
            >
              {/* 🔹 ИМЯ с принудительно тёмным цветом и переносом */}
              <h2 className="font-bold text-lg text-gray-900 break-words min-w-0 leading-tight mb-2">
                {m.name}
              </h2>

              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-800 text-sm font-medium">📍 {m.district}</p>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium shrink-0">
                  {m.category}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {m.skills.slice(0, 3).map((s, i) => (
                  <span key={i} className="bg-gray-200 text-gray-900 text-xs px-2 py-1 rounded font-medium">
                    {s}
                  </span>
                ))}
                {m.skills.length > 3 && (
                  <span className="text-xs text-gray-500">+{m.skills.length - 3}</span>
                )}
              </div>

              <div className="text-sm text-yellow-700 font-semibold">
                ⭐ {m.rating.toFixed(1)} • {m.reviewsCount || 0} отзывов
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
    export default Masters;
  );
}