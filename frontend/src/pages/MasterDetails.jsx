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
        
        // 🔹 Отладка: смотрим в консоль
        console.log('✅ MasterDetails ЗАГРУЗИЛСЯ, id:', id);
        console.log('✅ Masters loaded:', data);
         
        setMasters(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('❌ Fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMasters();
  }, [filterCat, filterDist]);

  if (loading) return <div className="p-8 text-center text-gray-500">Загрузка мастеров...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">🔧 Найти мастера в Бишкеке</h1>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="p-2 border rounded text-gray-800 bg-white"
        >
          <option value="">Все категории</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.label} className="text-gray-900">{c.label}</option>
          ))}
        </select>
        <select
          value={filterDist}
          onChange={e => setFilterDist(e.target.value)}
          className="p-2 border rounded text-gray-800 bg-white"
        >
          <option value="">Все районы</option>
          {DISTRICTS.map(d => (
            <option key={d} value={d} className="text-gray-900">{d}</option>
          ))}
        </select>
      </div>

      {/* Список */}
      {masters.length === 0 ? (
        <p className="text-center text-gray-500">Мастеров пока нет. Будьте первым!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masters.map(m => (
            <Link
              key={m.id}
              to={`/masters/${m.id}`}
              className="block bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-100"
            >
              {/* ИМЯ — с явным цветом и переносом */}
              <h2 className="font-bold text-lg text-gray-900 break-words leading-tight mb-1">
                {m.name}
              </h2>
              
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600 text-sm">📍 {m.district}</p>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
                  {m.category}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-3">
                {m.skills.slice(0, 3).map((s, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {s}
                  </span>
                ))}
              </div>
              
              <div className="text-sm text-yellow-600 font-medium">
                ⭐ {m.rating.toFixed(1)} • {m.reviewsCount || 0} отзывов
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
   export default MasterDetails;
  );
}