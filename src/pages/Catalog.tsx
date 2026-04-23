import { useState, useEffect, useCallback } from 'react';
import { Users, Loader2, SearchX } from 'lucide-react';
import { supabase } from '../lib/supabase';
import TutorCard from '../components/TutorCard';
import SearchForm from '../components/SearchForm';
import type { TutorProfile, SearchFilters } from '../lib/types';

export default function Catalog({ onViewTutor }: { onViewTutor: (id: string) => void }) {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    subject_id: '', district: '', price_max: 0, is_online: null, is_home: null
  });

  const fetchTutors = useCallback(async (f: SearchFilters) => {
    setLoading(true);
    try {
      // Запрашиваем данные из таблицы tutor_profiles
      let query = supabase
        .from('tutor_profiles')
        .select('*')
        .eq('is_active', true);

      if (f.district) query = query.eq('district', f.district);
      if (f.price_max > 0) query = query.lte('price_per_hour', f.price_max);
      if (f.is_online !== null) query = query.eq('is_online', f.is_online);
      if (f.is_home !== null) query = query.eq('is_home', f.is_home);

      const { data, error } = await query;
      if (error) throw error;
      
      setTutors(data || []);
    } catch (err) {
      console.error('Ошибка:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTutors(filters);
  }, [filters, fetchTutors]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Найти репетитора</h1>
          <SearchForm onSearch={setFilters} compact />
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-20"><SearchX className="mx-auto mb-4" />Нет репетиторов</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} onView={onViewTutor} />
            ))}
          </div>
        )}
       }
