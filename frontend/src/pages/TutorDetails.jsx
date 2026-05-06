// frontend/src/pages/TutorDetails.jsx
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function TutorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tutor, setTutor] = useState(location.state?.tutor || null);
  const [status, setStatus] = useState(location.state?.tutor ? 'success' : 'loading');
  const [debug, setDebug] = useState('');

  useEffect(() => {
    if (tutor) { setStatus('success'); return; }
    
    const load = async () => {
      try {
        const log = [];
        log.push(`🔍 ID из URL: "${id}" (type: ${typeof id})`);
        
        const res = await fetch('/api/tutors');
        log.push(`📡 Статус: ${res.status}`);
        
        const data = await res.json();
        log.push(`📦 Ответ: ${JSON.stringify(data).slice(0, 150)}...`);
        log.push(`📋 Массив? ${Array.isArray(data)}, Длина: ${data.length}`);
        
        // 🔎 Ищем с подробным логом
        const found = data.find((t, idx) => {
          const tId = t.id ?? t.userId ?? t.tutorId;
          const match = String(tId) === String(id);
          log.push(`  [${idx}] t.id=${tId} (${typeof tId}) vs URL id=${id} (${typeof id}) → ${match ? '✅ MATCH' : '❌'}`);
          return match;
        });
        
        if (found) {
          log.push(`✅ Нашли: ${JSON.stringify({ id: found.id, name: found.name || found.user?.name })}`);
          setTutor(found);
          setStatus('success');
        } else {
          log.push(`❌ Не нашли. Доступные ID: [${data.map(t => t.id ?? t.userId ?? t.tutorId).join(', ')}]`);
          setStatus('error');
        }
        setDebug(log.join('\n'));
        console.log('🔧 TutorDetails debug:', log.join('\n'));
        
      } catch (e) {
        console.error('💥 Error:', e);
        setDebug(`Ошибка: ${e.message}`);
        setStatus('error');
      }
    };
    load();
  }, [id, tutor]);

  if (status === 'loading') return <div className="p-8 text-center">Загрузка...</div>;

  if (status === 'error') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <button onClick={() => navigate('/tutors')} className="mb-4 text-blue-600 underline">← Назад</button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="font-semibold text-red-700 mb-2">⚠️ Репетитор не найден</p>
          <pre className="text-xs bg-white p-3 rounded overflow-auto max-h-60">{debug}</pre>
        </div>
      </div>
    );
  }

  // ✅ Успех
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <button onClick={() => navigate('/tutors')} className="mb-4 text-blue-600 underline">← Назад</button>
      <h1 className="text-2xl font-bold mb-2">{tutor.user?.name || tutor.name || 'Репетитор'}</h1>
      <p className="text-gray-600 mb-4">{tutor.subjects}</p>
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>Опыт: <b>{tutor.experience || '—'} лет</b></div>
        <div>Цена: <b>{tutor.pricePerHour || '—'} ₽/час</b></div>
        <div>Формат: <b>{tutor.formats || '—'}</b></div>
        <div>Рейтинг: <b>{tutor.rating || 'Новичок'}</b></div>
      </div>
      <p className="text-gray-700 mb-6">{tutor.bio || 'Нет описания'}</p>
      <button className="w-full bg-blue-600 text-white py-3 rounded font-semibold">Записаться</button>
    </div>
  );
}