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

const Home = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [format, setFormat] = useState('any');
  const [maxBudget, setMaxBudget] = useState('');

  // Загружаем всех репетиторов один раз при открытии
  useEffect(() => {
    fetch('`${API_URL}/api/tutors')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => { setTutors(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setTutors([]); setLoading(false); });
  }, []);

  const handleCategoryChange = (e) => { setCategory(e.target.value); setSubject(''); };

  // 🧠 Та же гибкая логика фильтрации, что и в каталоге
  const filteredTutors = useMemo(() => {
    if (!searched) return []; // Показываем результаты только после клика "Найти"
    let result = tutors;

    if (category) {
      const allowed = (SUBJECTS_BY_CATEGORY[category] || []).map(s => s.trim().toLowerCase());
      result = result.filter(t => {
        if (!t.subjects) return false;
        const tSubs = t.subjects.split(',').map(s => s.trim().toLowerCase());
        return allowed.some(a => tSubs.some(sub => sub === a || sub.includes(a) || a.includes(sub)));
      });
    }

    if (subject) {
      const target = subject.trim().toLowerCase();
      result = result.filter(t => t.subjects && t.subjects.toLowerCase().includes(target));
    }

    if (format !== 'any') {
      result = result.filter(t => t.formats && t.formats.includes(format));
    }

    if (maxBudget) {
      result = result.filter(t => t.pricePerHour && t.pricePerHour <= Number(maxBudget));
    }

    return result;
  }, [tutors, category, subject, format, maxBudget, searched]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
  };

  if (loading) return <div className="text-center py-20 text-gray-500 text-lg">Загрузка данных...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Найти репетитора</h1>

        <form onSubmit={handleSearch} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-lg mx-auto space-y-4 mb-12">
          <h2 className="text-xl font-semibold text-gray-800 text-center">Параметры поиска</h2>
          
          <select value={category} onChange={handleCategoryChange} className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <option value="">Выберите категорию</option>
            {Object.keys(SUBJECTS_BY_CATEGORY).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select value={subject} onChange={(e) => setSubject(e.target.value)} disabled={!category} className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100 disabled:text-gray-400">
            <option value="">{category ? 'Выберите направление' : 'Сначала выберите категорию'}</option>
            {category && SUBJECTS_BY_CATEGORY[category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>

          <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <option value="any">Любой формат</option>
            <option value="online">Онлайн</option>
            <option value="offline">Офлайн</option>
          </select>

          <input type="number" placeholder="Почасовая ставка (сом)" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md active:scale-[0.98]">
            Найти репетитора
          </button>
        </form>

        {searched && filteredTutors.length === 0 && (
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-lg mx-auto">
            <p className="text-xl text-gray-500">😔 Репетиторы не найдены</p>
            <p className="text-sm text-gray-400 mt-2">Попробуйте изменить фильтры или выберите другую категорию</p>
          </div>
        )}

        {searched && filteredTutors.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Найдено: {filteredTutors.length}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map(tutor => (
                <Link key={tutor.id} to={`/tutors/${tutor.id}`} className="block bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 cursor-pointer group">
                  {tutor.subjects && (
                    <span className="inline-block px-2 py-0.5 mb-2 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                      {tutor.subjects.split(',')[0].trim()}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition">{tutor.user?.name || 'Репетитор'}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tutor.bio || 'Без описания'}</p>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <span className="text-green-600 font-bold">{tutor.pricePerHour} сом/час</span>
                    <span className="text-sm text-gray-500">
                      {tutor.formats?.includes('online') && '🖥️'}
                      {tutor.formats?.includes('offline') && ' 🏫'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;