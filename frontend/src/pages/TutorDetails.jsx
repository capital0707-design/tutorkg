// frontend/src/pages/TutorDetails.jsx
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function TutorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tutor, setTutor] = useState(location.state?.tutor || null);
  const [loading, setLoading] = useState(!location.state?.tutor);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (tutor) { setLoading(false); return; }

    const load = async () => {
      try {
        const res = await fetch('/api/tutors');
        const data = await res.json();
        
        // 🔍 Логируем ВСЁ для отладки
        const log = {
          urlId: id,
          urlIdType: typeof id,
          apiResponse: data,
          availableIds: data.map(t => ({ 
            id: t.id, 
            userId: t.userId, 
            tutorId: t.tutorId,
            user_id: t.user?.id,
            name: t.user?.name || t.name || t.subjects 
          })),
          found: null
        };

        // 🔎 Ищем по ВСЕМ возможным полям, сравнивая как строки
        const found = data.find(t => {
          const candidates = [t.id, t.userId, t.tutorId, t.user?.id, t.user?.userId].filter(v => v != null);
          return candidates.some(cid => String(cid) === String(id));
        });

        log.found = found ? { id: found.id, name: found.user?.name || found.name } : null;
        setDebugInfo(log);
        console.log('🔧 DEBUG TutorDetails:', log);

        if (found) {
          setTutor(found);
        } else {
          // Не выбрасываем ошибку, просто показываем отладку
        }
      } catch (e) {
        console.error('💥 Error:', e);
        setDebugInfo({ error: e.message });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, tutor]);

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;

  // ✅ Успех
  if (tutor) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
        <button onClick={() => navigate('/tutors')} className="mb-4 text-blue-600 underline">← Назад</button>
        <h1 className="text-2xl font-bold mb-2">{tutor.user?.name || tutor.name || 'Репетитор'}</h1>
        <p className="text-gray-600 mb-4">{tutor.subjects}</p>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>Опыт: <b>{tutor.experience || '—'}</b></div>
          <div>Цена: <b>{tutor.pricePerHour || '—'} ₽/час</b></div>
          <div>Формат: <b>{tutor.formats || '—'}</b></div>
          <div>Рейтинг: <b>{tutor.rating || 'Новичок'}</b></div>
        </div>
        <p className="text-gray-700 mb-6">{tutor.bio || 'Нет описания'}</p>
        <button className="w-full bg-blue-600 text-white py-3 rounded font-semibold">Записаться</button>
      </div>
    );
  }

  // ❌ Не нашли — показываем отладочную информацию
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate('/tutors')} className="mb-4 text-blue-600 underline">← Назад</button>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="font-semibold text-yellow-800 mb-2">⚠️ Репетитор не найден</p>
        <div className="text-xs space-y-2">
          <p><b>ID из URL:</b> <code>{debugInfo?.urlId}</code> (тип: {debugInfo?.urlIdType})</p>
          <p><b>Доступные ID в ответе API:</b></p>
          <pre className="bg-white p-2 rounded overflow-auto max-h-40 text-[10px]">
            {JSON.stringify(debugInfo?.availableIds, null, 2)}
          </pre>
          <p><b>Результат поиска:</b> {debugInfo?.found ? '✅ Нашли' : '❌ Не нашли'}</p>
        </div>
      </div>
    </div>
  );
}