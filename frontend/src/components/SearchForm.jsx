import { useState, useEffect } from 'react';
import { API_URL } from '../config/api';


const SearchForm = ({ onSearch }) => {
  const [formData, setFormData] = useState({ subject: '', format: 'any', maxBudget: '' });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch('`${API_URL}/api/subjects')
      .then(res => res.json())
      .then(data => setSubjects(Array.isArray(data) ? data : []))
      .catch(err => console.error('Ошибка загрузки предметов:', err));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(formData);
  };

  // 🎨 Белый фон формы + мягкие границы + темный текст в полях
  const inputClass = "w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl border border-white/20 p-6 max-w-lg mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Найти репетитора</h2>
      
      <select name="subject" value={formData.subject} onChange={handleChange} className={inputClass}>
        <option value="">Выберите предмет</option>
        {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
      </select>

      <select name="format" value={formData.format} onChange={handleChange} className={inputClass}>
        <option value="any">Любой формат</option>
        <option value="online">Онлайн</option>
        <option value="offline">Очно</option>
      </select>

      <input 
        name="maxBudget" 
        type="number" 
        placeholder="Почасовая ставка (сом)" 
        value={formData.maxBudget} 
        onChange={handleChange} 
        className={inputClass} 
      />

      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-lg">
        Найти
      </button>
    </form>
  );
};

export default SearchForm;