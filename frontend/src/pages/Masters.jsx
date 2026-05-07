import { useState, useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, DISTRICTS } from '../config/masters';

export default function Masters() {
  const [masters, setMasters] = useState([]);
  const [filterCat, setFilterCat] = useState('');
  const [filterDist, setFilterDist] = useState('');
  const [loading, setLoading] = useState(true);

  // 🔹 Гарантированный фикс белого текста в выпадающих списках
  useLayoutEffect(() => {
    const style = document.createElement('style');
    style.textContent = `select option { color: #111827 !important; background-color: #ffffff !important; }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const fetchMasters = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterCat) params.append('category', filterCat);
        if (filterDist) params.append('district', filterDist);

        const res = await fetch(`/api/masters?${params.toString()}`);
        const data = await res.json();
        setMasters(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Ошибка загрузки мастеров:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMasters();
  }, [filterCat, filterDist]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🔧 Найти мастера в Бишкеке</h1>

      <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="p-2 border rounded text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все категории</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.label}>{c.label}</option>
          ))}
        </select>

        <select
          value={filterDist}
          onChange={e => setFilterDist(e.target.value)}
          className="p-2 border rounded text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все районы</option>
          {DISTRICTS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Загрузка...</p>
      ) : masters.length === 0 ? (
        <p className="text-center text-gray-500">Мастеров пока нет. Будьте первым!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masters.map(m => (
            <Link
              key={m.id}
              to={`/masters/${m.id}`}
              className="block bg-white p-5 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
              <h2 className="font-bold text-lg break-words min-w-0 pr-2">{m.name}</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded shrink-0 whitespace-nowrap">
              {m.category}
                  </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">📍 {m.district} район</p>
              <div className="flex flex-wrap gap-2">
                {m.skills.slice(0, 3).map((s, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {s}
                  </span>
                ))}
                {m.skills.length > 3 && (
                  <span className="text-xs text-gray-500">+{m.skills.length - 3}</span>
                )}
              </div>
              <div className="mt-3 text-sm text-yellow-600">
                ⭐ {m.rating.toFixed(1)} ({m.reviewsCount} отзывов)
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}