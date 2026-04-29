import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminTutors() {
  const [tutors, setTutors] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    axios.get(`${API}/tutors`, headers).then(({ data }) => setTutors(data));
  }, []);

  const toggleVerify = async (id) => {
    try {
      // В реальном проекте лучше отдельный PATCH /admin/tutors/:id/verify
      // Для MVP просто обновляем статус на фронте, бэкенд уже поддерживает PATCH
      const tutor = tutors.find(t => t.id === id);
      await axios.patch(`${API}/tutors/${id}`, { ...tutor, isVerified: !tutor.isVerified }, headers);
      setTutors(tutors.map(t => t.id === id ? { ...t, isVerified: !t.isVerified } : t));
    } catch {}
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Управление репетиторами</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Имя</th>
              <th className="p-3">Предметы</th>
              <th className="p-3">Рейтинг</th>
              <th className="p-3">Статус</th>
              <th className="p-3">Действие</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map(t => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{t.user?.name}</td>
                <td className="p-3 text-sm">{t.subjects?.join(', ')}</td>
                <td className="p-3">{t.rating.toFixed(1)} ({t.reviewCount})</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${t.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {t.isVerified ? 'Подтверждён' : 'На проверке'}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => toggleVerify(t.id)} className="text-blue-600 text-sm hover:underline">
                    {t.isVerified ? 'Снять подтверждение' : 'Подтвердить'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}