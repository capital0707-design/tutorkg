import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import TutorCard from './TutorCard';

export default function Catalog() {
  // 1. Убедитесь, что здесь ПУСТОЙ массив, а не Петр с Айнурой
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTutors() {
      try {
        setLoading(true);
        // Запрашиваем данные из правильной таблицы
        const { data, error } = await supabase
          .from('tutor_profiles') 
          .select('*');

        if (error) throw error;

        console.log("Данные получены:", data); // Проверим в консоли (F12)
        setTutors(data || []);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTutors();
  }, []);

  if (loading) return <div className="text-center p-10">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.length > 0 ? (
          tutors.map((tutor) => (
            // 2. Используем компонент карточки и передаем данные из базы
            <TutorCard key={tutor.id} tutor={tutor} />
          ))
        ) : (
          // 3. Если в базе пусто, вы увидите это сообщение, а не Петра
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">В базе пока нет репетиторов.</p>
          </div>
        )}
      </div>
    </div>
  );
}


