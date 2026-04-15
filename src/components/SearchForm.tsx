import { useState, useEffect } from 'react';
import { Search, ChevronDown, Monitor, Home, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SubjectCategory, Subject, SearchFilters } from '../lib/types';
import { BISHKEK_DISTRICTS } from '../lib/types';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  compact?: boolean;
}

export default function SearchForm({ onSearch, compact = false }: SearchFormProps) {
  const [categories, setCategories] = useState<SubjectCategory[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [priceMax, setPriceMax] = useState(0);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isHome, setIsHome] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('subject_categories')
        .select('*')
        .order('sort_order');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      let query = supabase.from('subjects').select('*').order('sort_order');
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }
      const { data } = await query;
      if (data) setSubjects(data);
    };
    fetchSubjects();
    setSelectedSubject('');
  }, [selectedCategory]);

  const handleSearch = () => {
    onSearch({
      subject_id: selectedSubject,
      district: selectedDistrict,
      price_max: priceMax,
      is_online: isOnline,
      is_home: isHome,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${compact ? 'p-4' : 'p-6'}`}>
      <div className={`grid gap-3 ${compact ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 md:grid-cols-3'}`}>
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            Категория
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="">Все категории</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            Предмет
          </label>
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="">Все предметы</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            Район
          </label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="">Весь Бишкек</option>
              {BISHKEK_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showFilters ? 'Скрыть фильтры' : 'Дополнительные фильтры'}
        </button>

        <button
          onClick={handleSearch}
          onKeyDown={handleKeyDown}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Search className="w-4 h-4" />
          Найти репетитора
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              Макс. цена (сом/час)
            </label>
            <input
              type="number"
              value={priceMax || ''}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              placeholder="Без ограничений"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Формат занятий
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOnline === true}
                  onChange={(e) => setIsOnline(e.target.checked ? true : null)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Monitor className="w-4 h-4 text-blue-500" />
                  Онлайн
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHome === true}
                  onChange={(e) => setIsHome(e.target.checked ? true : null)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Home className="w-4 h-4 text-emerald-500" />
                  Офлайн/Выезд на дом
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
