import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminSubjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get(`${API}/subjects`);
      setSubjects(data);
    } catch (err) {
      setError('Не удалось загрузить предметы');
    }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSubject.name.trim()) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await axios.post(`${API}/subjects`, newSubject, headers);
      setNewSubject({ name: '', category: '' });
      setSuccess('✅ Предмет добавлен');
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка добавления');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Скрыть этот предмет из списка?')) return;
    try {
      await axios.delete(`${API}/subjects/${id}`, headers);
      setSuccess('✅ Предмет скрыт');
      fetchSubjects();
    } catch (err) {
      setError('Ошибка удаления');
    }
  };

  if (user?.role !== 'ADMIN') {
    return <div className="p-6 text-red-600">🔒 Доступ только для администратора</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 Управление предметами</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
      
      {/* Форма добавления */}
      <form onSubmit={handleAdd} className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
        <input
          type="text"
          placeholder="Название предмета*"
          value={newSubject.name}
          onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
          className="border border-gray-400 px-3 py-2 rounded flex-1 min-w-[200px]"
          required
        />
        <select
          value={newSubject.category}
          onChange={(e) => setNewSubject({...newSubject, category: e.target.value})}
          className="border border-gray-400 px-3 py-2 rounded"
        >
          <option value="">Категория</option>
          <option value="school">🎒 Для школы</option>
          <option value="languages">🌍 Языки</option>
          <option value="creative">🎨 Творчество</option>
        </select>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '...' : '➕ Добавить'}
        </button>
      </form>

      {/* Список */}
      <div className="space-y-2">
        {subjects.map(subj => (
          <div key={subj.id} className="flex justify-between items-center p-3 bg-white border rounded-lg">
            <div>
              <span className="font-medium">{subj.name}</span>
              {subj.category && (
                <span className="ml-2 text-sm text-gray-500">• {categoryLabels[subj.category] || subj.category}</span>
              )}
            </div>
            <button
              onClick={() => handleDelete(subj.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Скрыть
            </button>
          </div>
        ))}
        {subjects.length === 0 && (
          <p className="text-gray-500 text-center py-4">Нет предметов. Добавьте первый!</p>
        )}
      </div>
    </div>
  );
}

const categoryLabels = {
  school: 'Для школы',
  languages: 'Языки',
  creative: 'Творчество'
};