import { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

const BookingModal = ({ isOpen, onClose, tutor }) => {
  if (!isOpen || !tutor) return null;

  const [formData, setFormData] = useState({
    studentName: '',
    phone: '+996 ', // ✅ Автопрефикс
    date: '',
    time: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Сброс при открытии
  useEffect(() => {
    if (isOpen) {
      setFormData({ studentName: '', phone: '+996 ', date: '', time: '', message: '' });
      setErrors({});
      setSuccess(false);
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.studentName.trim()) newErrors.studentName = 'Имя обязательно';
    else if (!/^[a-zA-Zа-яА-ЯёЁ\-'\s]{2,50}$/.test(formData.studentName)) newErrors.studentName = 'Только буквы, 2-50 символов';

    // ✅ Строгая проверка формата +996 XXX XXX XXX
    if (!formData.phone.trim() || formData.phone === '+996') {
      newErrors.phone = 'Введите номер полностью';
    } else if (!/^\+996 \d{3} \d{3} \d{3}$/.test(formData.phone)) {
      newErrors.phone = 'Пример: +996 700 123 456';
    }

    if (!formData.date) newErrors.date = 'Дата обязательна';
    else if (new Date(formData.date) < new Date(new Date().setHours(0,0,0,0))) newErrors.date = 'Выберите будущую дату';

    if (!formData.time) newErrors.time = 'Время обязательно';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  // ✅ Умная маска телефона: только цифры, автоформатирование, защита от лишних символов
  const handlePhoneChange = (e) => {
    let raw = e.target.value.replace(/\D/g, ''); // Оставляем только цифры
    
    // Если пользователь ввел 996 вручную или случайно, убираем
    if (raw.startsWith('996')) raw = raw.slice(3);
    
    // Ограничиваем 9 цифрами (стандартный формат КР)
    const trimmed = raw.slice(0, 9);

    let formatted = '+996';
    if (trimmed.length > 0) formatted += ' ' + trimmed.slice(0, 3);
    if (trimmed.length > 3) formatted += ' ' + trimmed.slice(3, 6);
    if (trimmed.length > 6) formatted += ' ' + trimmed.slice(6, 9);

    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('fetch(`${API_URL}/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tutorId: tutor.id })
      });
      if (!res.ok) throw new Error('Ошибка сервера');
      setSuccess(true);
      setTimeout(onClose, 2500);
    } catch (err) {
      setErrors({ submit: err.message || 'Не удалось отправить заявку' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl transition">&times;</button>
        
        <h2 className="text-xl font-bold text-gray-900 mb-1">Запись к репетитору</h2>
        <p className="text-sm text-gray-500 mb-4">{tutor.user?.name} • {tutor.pricePerHour} сом/час</p>

        {success ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-green-600 font-semibold text-lg">Заявка успешно отправлена!</p>
            <p className="text-sm text-gray-500 mt-1">Репетитор свяжется с вами в ближайшее время.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Имя */}
            <input name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Ваше имя" className={`w-full p-3 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.studentName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
            {errors.studentName && <p className="text-red-500 text-xs -mt-2">{errors.studentName}</p>}

            {/* 📱 Телефон с маской +996 */}
            <input 
              name="phone" 
              type="tel" 
              value={formData.phone} 
              onChange={handlePhoneChange}
              placeholder="+996 XXX XXX XXX"
              inputMode="tel"
              className={`w-full p-3 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} 
            />
            {errors.phone && <p className="text-red-500 text-xs -mt-2">{errors.phone}</p>}

            {/* Дата и время */}
            <div className="flex gap-3">
              <div className="flex-1">
                <input name="date" type="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className={`w-full p-3 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
                {errors.date && <p className="text-red-500 text-xs -mt-2">{errors.date}</p>}
              </div>
              <div className="flex-1">
                <input name="time" type="time" value={formData.time} onChange={handleChange} className={`w-full p-3 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.time ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
                {errors.time && <p className="text-red-500 text-xs -mt-2">{errors.time}</p>}
              </div>
            </div>

            {/* Комментарий */}
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Комментарий или пожелания" rows="2" className="w-full p-3 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition"></textarea>
            
            {errors.submit && <p className="text-red-500 text-sm text-center font-medium">{errors.submit}</p>}
            
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-wait">
              {loading ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;