import { useState, useEffect, useCallback } from 'react';
import { Users, Loader2, SearchX } from 'lucide-react';
// Импортируем наши локальные данные
import { myData } from '../data/data';
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

  const fetchTutors = useCallback((f: SearchFilters) => {
    setLoading(true);
    
    // Имитируем небольшую задержку для естественности, но берем данные из myData
    setTimeout(() => {
      let result = [...(myData as unknown as TutorProfile[])];

      // Фильтр по району
      if (f.district) {
        result = result.filter(t => t.district === f.district);
      }

      // Фильтр по цене
      if (f.price_max > 0) {
        result = result.filter(t => t.price_per_hour <= f.price_max);
      }

      // Фильтр по формату (онлайн)
      if (f.is_online === true) {
        result = result.filter(t => t.is_online === true);
      }

      // Фильтр по формату (выезд на дом)
      if (f.is_home === true) {
        result = result.filter(t => t.is_home === true);
      }

      // Фильтр по предмету
      if (f.subject_id) {
        result = result.filter((t) => 
          t.subjects?.some((s) => s.id === f.subject_id)
        );
      }

      setTutors(result);
      setLoading(false);
    }, 300); 
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
