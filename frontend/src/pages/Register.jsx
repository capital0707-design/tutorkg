import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'STUDENT',
    experience: '', pricePerHour: '', category: '', subject: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [formats, setFormats] = useState({ online: false, offline: false });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'name') {
      setNameError(value.length > 0 && !/^[a-zA-Zа-яА-ЯёЁ\-'\s]{2,50}$/.test(value) ? 'Имя: только буквы, 2-50 символов' : '');
    }
  };

  const handleCategoryChange = (e) => {
    setFormData(prev => ({ ...prev, category: e.target.value, subject: '' }));
  };

  const handleFormatChange = (e) => setFormats(prev => ({ ...prev, [e.target.name]: e.target.checked }));

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoError('');
    if (!file) { setPhoto(null); setPhotoPreview(''); return; }
    if (!file.type.startsWith('image/')) { setPhotoError('Разрешены только изображения'); return; }
    if (file.size > 2 * 1024 * 1024) { setPhotoError('Максимальный размер: 2 МБ'); return; }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) return alert('Примите условия соглашения');
    if (nameError || !formData.name.trim()) return alert('Проверьте имя');
    
    if (formData.role === 'TUTOR') {
      if (!formData.experience || !formData.pricePerHour) return alert('Укажите опыт и ставку');
      if (!formats.online && !formats.offline) return alert('Выберите формат работы');
      if (!formData.subject) return alert('Выберите категорию и направление');
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name, email: formData.email, password: formData.password, role: formData.role
      };

      if (formData.role === 'TUTOR') {
        payload.experience = Number(formData.experience);
        payload.pricePerHour = Number(formData.pricePerHour);
        payload.subjects = formData.subject; // Сохраняем выбранное направление
        payload.formats = Object.keys(formats).filter(k => formats[k]).join(',');
        if (photo) {
          payload.photoBase64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(photo);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
          });
        }
      }

      const res = await fetch('http://127.0.0.1:5000/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      alert(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Регистрация</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Ваше Имя, Отчество" required className={`w-full p-3 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition ${nameError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
          {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
        </div>
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="E-mail" required className="w-full p-3 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" />
        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Пароль" required className="w-full p-3 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" />

        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="role" value="STUDENT" checked={formData.role === 'STUDENT'} onChange={handleChange} className="w-4 h-4 text-blue-600" />
            <span className="text-gray-800 font-medium">Ученик</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="role" value="TUTOR" checked={formData.role === 'TUTOR'} onChange={handleChange} className="w-4 h-4 text-blue-600" />
            <span className="text-gray-800 font-medium">Репетитор</span>
          </label>
        </div>

        {formData.role === 'TUTOR' && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200 transition-all">
            <h3 className="text-sm font-semibold text-blue-800 mb-1">Профиль репетитора</h3>
            
            <input name="experience" type="number" value={formData.experience} onChange={handleChange} placeholder="Опыт работы (лет)" min="0" required className="w-full p-3 border border-blue-300 rounded text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
            <input name="pricePerHour" type="number" value={formData.pricePerHour} onChange={handleChange} placeholder="Почасовая ставка (сом)" min="0" required className="w-full p-3 border border-blue-300 rounded text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none" />

            {/* 📦 Категории и предметы */}
            <div className="space-y-3">
              <select name="category" value={formData.category} onChange={handleCategoryChange} required className="w-full p-3 border border-blue-300 rounded text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Выберите категорию</option>
                {Object.keys(SUBJECTS_BY_CATEGORY).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select name="subject" value={formData.subject} onChange={handleChange} disabled={!formData.category} required className="w-full p-3 border border-blue-300 rounded text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400">
                <option value="">{formData.category ? 'Выберите направление' : 'Сначала выберите категорию'}</option>
                {formData.category && SUBJECTS_BY_CATEGORY[formData.category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">Формат работы</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded border border-gray-300">
                  <input type="checkbox" name="online" checked={formats.online} onChange={handleFormatChange} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-gray-800">🖥️ Онлайн</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded border border-gray-300">
                  <input type="checkbox" name="offline" checked={formats.offline} onChange={handleFormatChange} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-gray-800">🏫 Офлайн</span>
                </label>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">Фото профиля (макс. 2 МБ)</span>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer bg-white px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-center">
                  <span className="text-sm">📷 Выбрать фото</span>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
                {photoPreview && <button type="button" onClick={() => { setPhoto(null); setPhotoPreview(''); setPhotoError(''); }} className="text-red-500 hover:text-red-700 text-sm">✕</button>}
              </div>
              {photoPreview && <img src={photoPreview} alt="Preview" className="mt-2 h-16 w-16 object-cover rounded-full border border-gray-200" />}
              {photoError && <p className="text-red-500 text-xs mt-1">{photoError}</p>}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 pt-2">
          <input type="checkbox" id="agree" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
          <label htmlFor="agree" className="text-sm text-gray-700 leading-tight cursor-pointer">
            Я согласен с <Link to="/terms" className="text-blue-600 hover:underline font-medium">Пользовательским соглашением</Link> и <Link to="/privacy" className="text-blue-600 hover:underline font-medium ml-1">Политикой конфиденциальности</Link>
          </label>
        </div>

        <button type="submit" disabled={!agreeTerms || loading} className={`w-full py-3 rounded-lg font-semibold transition ${agreeTerms && !loading ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' : 'bg-gray-400 text-gray-500 cursor-not-allowed'}`}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        Уже есть аккаунт? <Link to="/login" className="text-blue-600 hover:underline">Войти</Link>
      </p>
    </div>
  );
};

export default Register;