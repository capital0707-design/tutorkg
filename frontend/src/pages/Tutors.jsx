import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

const SUBJECTS_BY_CATEGORY = {
  "Языки": [
    "Английский язык (Школьная программа)", "Английский язык (IELTS/TOEFL/ЕГЭ)", "Английский язык (Разговорный / Business)", "Английский язык (Для детей 6–12 лет)",
    "Русский язык (Школьная программа)", "Русский язык (Подготовка к ОРТ/НЦТ)", "Русский язык (Грамматика, орфография, сочинения)",
    "Китайский язык", "Немецкий", "Турецкий", "Японский"
  ],
  "Подготовка к школе и дошкольники": ["Подготовка к 1 классу", "Развитие речи и мышления", "Счёт, ориентация в пространстве", "Мелкая моторика и письмо", "Логические игры, знакомство с цифрами и буквами"],
  "Школьная программа": ["Математика", "Физика", "Химия", "Биология", "География"],
  "Подготовка к экзаменам и поступлению": ["ОРТ/НЦТ (общая подготовка)", "Математика", "Русский язык", "Физика", "Химия", "Биология", "Информатика", "Подготовка к ЕГЭ", "Вузовская подготовка", "Обществознание, экономика, право", "Английский для международных программ / тестов"],
  "IT и цифровые навыки": ["Программирование", "Python для начинающих", "Веб-разработка (HTML/CSS, JS, БД)", "Базы данных (Access / no code)", "Подготовка к IT карьере", "Помощь в обучении для студентов IT направлений"],
  "Логопеды и дефектологи": ["Логопедия у детей", "Косноязычие, речь", "Формирование звуковой базы", "Логопедия у взрослых", "Речевые нарушения после травм, операций", "Дефектология / коррекционное обучение"]
};

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
  // 🔹 ОТЛАДКА: выводим значение API_URL в консоль
  console.log('=== DEBUG API_URL ===');
  console.log('API_URL из config:', API_URL);
  console.log('import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('=====================');

  const fetchTutors = async () => {
    // ... дальше идёт твой существующий код с fetch
  fetch(`${API_URL}/tutors`)
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки каталога');
        return res.json();
      })
      .then(data => { setTutors(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  // ⚡ Умная и устойчивая фильтрация
  const filteredTutors = useMemo(() => {
    let result = tutors;

    if (category) {
      const allowedSubjects = SUBJECTS_BY_CATEGORY[category] || [];
      result = result.filter(t => {
        if (!t.subjects) return false;
        // Разбиваем предметы репетитора по запятой, убираем пробелы, приводим к нижнему регистру
        const tutorSubs = t.subjects.split(',').map(s => s.trim().toLowerCase());
        
        // Проверяем, есть ли хоть одно совпадение (включая частичное)
        return allowedSubjects.some(allowed => {
          const normAllowed = allowed.toLowerCase();
          return tutorSubs.some(sub => 
            sub === normAllowed || 
            sub.includes(normAllowed) || 
            normAllowed.includes(sub)
          );
        });
      });
    }

    if (subject) {
      const target = subject.trim().toLowerCase();
      result = result.filter(t => {
        if (!t.subjects) return false;
        return t.subjects.toLowerCase().includes(target);
      });
    }

    return result;
  }, [tutors, category, subject]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubject('');
  };

  const resetFilters = () => {
    setCategory('');
    setSubject('');
  };

  if (loading) return <div className="text-center py-20 text-gray-500 text-lg">Загрузка каталога...</div>;
  if (error) return <div className="text-center py-20 text-red-500 bg-white rounded-xl shadow max-w-md mx-auto mt-10 p-6">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Все репетиторы</h1>

      {/* 🔍 Панель фильтров */}
      <div className="max-w-lg mx-auto mb-8 bg-white p-4 rounded-xl shadow border border-gray-200 flex flex-col sm:flex-row gap-3">
        <select value={category} onChange={handleCategoryChange} className="flex-1 p-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
          <option value="">Все категории</option>
          {Object.keys(SUBJECTS_BY_CATEGORY).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select value={subject} onChange={(e) => setSubject(e.target.value)} disabled={!category} className="flex-1 p-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100 disabled:text-gray-400">
          <option value="">{category ? 'Все направления' : 'Сначала категорию'}</option>
          {category && SUBJECTS_BY_CATEGORY[category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>
        {(category || subject) && (
          <button onClick={resetFilters} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
            ✕ Сбросить
          </button>
        )}
      </div>

      {filteredTutors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg">Репетиторы по выбранному направлению не найдены</p>
          <button onClick={resetFilters} className="text-blue-600 hover:underline mt-2 font-medium">Сбросить фильтры</button>
        </div>
      ) : (
        <>
          <p className="text-center text-gray-600 mb-6 text-sm">
            Показано: <span className="font-semibold text-gray-800">{filteredTutors.length}</span> из {tutors.length}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map(tutor => (
              <Link key={tutor.id} to={`/tutors/${tutor.id}`} className="block bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 cursor-pointer group">
                {tutor.subjects && (
                  <span className="inline-block px-2 py-0.5 mb-2 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                    {tutor.subjects.split(',')[0].trim()}
                  </span>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600 shrink-0">
                    {tutor.user?.name?.[0] || '👤'}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">{tutor.user?.name || 'Репетитор'}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tutor.bio || 'Без описания'}</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-green-600 font-bold">{tutor.pricePerHour} сом/час</span>
                  <span className="text-sm text-gray-500">
                    {tutor.formats?.includes('online') && '🖥️'}
                    {tutor.formats?.includes('offline') && ' 🏫'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Tutors;