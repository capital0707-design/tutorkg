import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import TutorCard from './TutorCard'; // Ваш компонент карточки

export default function Catalog() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTutors() {
      try {
        setLoading(true);
        import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
// Импортируйте вашу карточку репетитора
// import TutorCard from './TutorCard'; 

export default function Catalog() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTutors() {
      try {
        setLoading(true);
        
        // ВОТ ЭТОТ КУСОК КОДА:
        const { data, error } = await supabase
          .from('tutor_profiles') 
          .select(`
            *,
            tutor_subjects (
              subjects (
                name,
                subject_categories (
                  name
                )
              )
            )
          `);

        if (error) {
          console.error('Ошибка Supabase:', error.message);
          throw error;
        }

        setTutors(data || []);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTutors();
  }, []); // Пустой массив означает, что запрос сработает 1 раз при загрузке

  if (loading) return <div className="p-10 text-center">Загрузка репетиторов...</div>;

  return (
    <section className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.length > 0 ? (
          tutors.map((tutor) => (
            // Здесь ваша верстка карточки. 
            // ВАЖНО: убедитесь, что пропсы соответствуют данным из базы (например tutor.full_name)
            <div key={tutor.id} className="border p-4 rounded-lg shadow">
              <h3 className="font-bold">{tutor.full_name || 'Без имени'}</h3>
              <p className="text-gray-600">{tutor.bio}</p>
              {/* Вывод предметов, если они подтянулись */}
              <div className="mt-2">
                {tutor.tutor_subjects?.map((ts: any) => (
                  <span key={ts.subjects.name} className="text-xs bg-blue-100 p-1 mr-1">
                    {ts.subjects.name}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Репетиторы не найдены. Проверьте таблицу tutor_profiles в базе.
          </p>
        )}
      </div>
    </section>
  );
}

        const { data, error } = await supabase
          .from('tutors') 
          .select('*');

        if (error) throw error;
        setTutors(data || []);
      } catch (error) {
        console.error('Ошибка загрузки:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTutors();
  }, []);

  if (loading) return <div>Загрузка репетиторов...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tutors.length > 0 ? (
        tutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))
      ) : (
        <p>Репетиторы не найдены</p>
      )}
    </div>
  );
}

