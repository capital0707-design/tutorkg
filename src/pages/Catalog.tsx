import { useState, useEffect, useCallback } from 'react';
import { Users, Loader2, SearchX } from 'lucide-react';
import { supabase } from '../lib/supabase';
import TutorCard from '../components/TutorCard';
import SearchForm from '../components/SearchForm';
import type { TutorProfile, SearchFilters } from '../lib/types';

interface CatalogProps {
  onViewTutor: (id: string) => void;
  initialFilters?: SearchFilters | null;
}

export default function Catalog({ onViewTutor, initialFilters }: CatalogProps) {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>(
    initialFilters || { subject_id: '', district: '', price_max: 0, is_online: null, is_home: null }
  );

  const fetchTutors = useCallback(async (f: SearchFilters) => {
    setLoading(true);
    try {
      let query = supabase
        .from('tutor_profiles')
        .select(`
          *,
          tutor_subjects (
            subjects (
              id,
              name,
              category_id
            )
          )
        `)
        .eq('is_active', true)
        .order('is_verified', { ascending: false })
        .order('created_at', { ascending: false });

      if (f.district) {
        query = query.eq('district', f.district);
      }
      if (f.price_max > 0) {
        query = query.lte('price_per_hour', f.price_max);
      }
      if (f.is_online === true) {
        query = query.eq('is_online', true);
      }
      if (f.is_home === true) {
        query = query.eq('is_home', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      type RawTutor = typeof data extends (infer T)[] | null ? T : never;

      let result: TutorProfile[] = (data || []).map((t: RawTutor) => {
        const raw = t as Record<string, unknown>;
        const rawSubjects = raw.tutor_subjects as Array<{ subjects: { id: string; name: string; category_id: string } | null }> | null;
        const subjects = (rawSubjects || [])
          .map((ts) => ts.subjects)
          .filter((s): s is { id: string; name: string; category_id: string } => s !== null);
        return {
          ...(raw as unknown as TutorProfile),
          subjects,
        };
      });

      if (f.subject_id) {
        result = result.filter((t) =>
          t.subjects?.some((s) => s.id === f.subject_id)
        );
      }

      setTutors(result);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTutors(filters);
  }, [fetchTutors, filters]);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Найти репетитора</h1>
          <SearchForm onSearch={handleSearch} compact />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            {loading ? (
              <span className="text-sm">Загрузка...</span>
            ) : (
              <span className="text-sm">
                Найдено <strong>{tutors.length}</strong> {tutors.length === 1 ? 'репетитор' : tutors.length < 5 ? 'репетитора' : 'репетиторов'}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="text-sm text-gray-500">Загружаем репетиторов...</span>
            </div>
          </div>
        ) : tutors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SearchX className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Репетиторы не найдены</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              Попробуйте изменить фильтры поиска или выбрать другой предмет
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {tutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} onView={onViewTutor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
