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

