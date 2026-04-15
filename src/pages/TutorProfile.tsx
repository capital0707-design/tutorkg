import { useState, useEffect } from 'react';
import {
  ArrowLeft, MapPin, Clock, Monitor, Home, CheckCircle,
  Phone, Star, Loader2, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { TutorProfile as TutorProfileType } from '../lib/types';

interface TutorProfilePageProps {
  tutorId: string;
  onBack: () => void;
}

export default function TutorProfilePage({ tutorId, onBack }: TutorProfilePageProps) {
  const [tutor, setTutor] = useState<TutorProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTutor = async () => {
      setLoading(true);
      try {
        const { data, error: err } = await supabase
          .from('tutor_profiles')
          .select(`
            *,
            tutor_subjects (
              subjects (
                id,
                name,
                category_id,
                subject_categories (
                  id,
                  name
                )
              )
            )
          `)
          .eq('id', tutorId)
          .eq('is_active', true)
          .maybeSingle();

        if (err) throw err;
        if (!data) {
          setError('Репетитор не найден');
          return;
        }

        type RawData = typeof data & { tutor_subjects?: Array<{ subjects: { id: string; name: string; category_id: string; subject_categories?: { id: string; name: string } | null } | null }> };
        const raw = data as RawData;

        const subjects = (raw.tutor_subjects || [])
          .map((ts) => ts.subjects)
          .filter((s): s is { id: string; name: string; category_id: string; subject_categories?: { id: string; name: string } | null } => s !== null)
          .map((s) => ({
            id: s.id,
            name: s.name,
            category_id: s.category_id,
            category: s.subject_categories ?? undefined,
          }));

        setTutor({ ...(raw as unknown as TutorProfileType), subjects });
      } catch {
        setError('Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [tutorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-sm text-gray-500">Загружаем профиль...</span>
        </div>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-gray-600">{error || 'Репетитор не найден'}</p>
          <button onClick={onBack} className="text-blue-600 text-sm hover:underline">
            Вернуться к каталогу
          </button>
        </div>
      </div>
    );
  }

  const initials = tutor.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('');

  const groupedSubjects = tutor.subjects?.reduce<Record<string, typeof tutor.subjects>>((acc, subject) => {
    const catName = subject.category?.name ?? 'Другое';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(subject);
    return acc;
  }, {}) ?? {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к каталогу
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start gap-5">
                <div className="relative flex-shrink-0">
                  {tutor.photo_url ? (
                    <img
                      src={tutor.photo_url}
                      alt={tutor.full_name}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-2xl">
                      {initials || '?'}
                    </div>
                  )}
                  {tutor.is_verified && (
                    <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{tutor.full_name}</h1>
                      {tutor.is_verified && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Проверенный репетитор
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {tutor.price_per_hour > 0 ? `${tutor.price_per_hour.toLocaleString()} сом` : 'По договору'}
                      </div>
                      {tutor.price_per_hour > 0 && (
                        <div className="text-xs text-gray-400">за час</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {tutor.experience_years > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        <Clock className="w-3.5 h-3.5" />
                        {tutor.experience_years} {tutor.experience_years === 1 ? 'год' : tutor.experience_years < 5 ? 'года' : 'лет'} опыта
                      </span>
                    )}
                    {tutor.district && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        {tutor.district}
                      </span>
                    )}
                    {tutor.is_online && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        <Monitor className="w-3.5 h-3.5" />
                        Онлайн
                      </span>
                    )}
                    {tutor.is_home && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm">
                        <Home className="w-3.5 h-3.5" />
                        Офлайн/Выезд на дом
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {tutor.bio && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <h2 className="font-semibold text-gray-800 mb-2">О себе</h2>
                  <p className="text-gray-600 leading-relaxed text-sm">{tutor.bio}</p>
                </div>
              )}
            </div>

            {Object.keys(groupedSubjects).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-4">Преподаваемые предметы</h2>
                <div className="space-y-4">
                  {Object.entries(groupedSubjects).map(([cat, subs]) => (
                    <div key={cat}>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{cat}</h3>
                      <div className="flex flex-wrap gap-2">
                        {subs.map((s) => (
                          <span key={s.id} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h2 className="font-semibold text-gray-800">Отзывы</h2>
              </div>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Star className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm">Отзывов пока нет</p>
                <p className="text-gray-300 text-xs mt-1">Будьте первым, кто оставит отзыв</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="font-semibold text-gray-800 mb-4">Записаться на занятие</h2>
              <div className="text-center mb-5">
                <div className="text-3xl font-bold text-blue-600">
                  {tutor.price_per_hour > 0 ? `${tutor.price_per_hour.toLocaleString()} сом` : 'По договору'}
                </div>
                {tutor.price_per_hour > 0 && (
                  <div className="text-sm text-gray-400 mt-0.5">за академический час</div>
                )}
              </div>

              {tutor.phone && (
                <a
                  href={`tel:${tutor.phone}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors mb-3"
                >
                  <Phone className="w-4 h-4" />
                  {tutor.phone}
                </a>
              )}

              <a
                href={tutor.phone ? `https://wa.me/${tutor.phone.replace(/\D/g, '')}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
              >
                Написать в WhatsApp
              </a>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                {tutor.is_online && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Monitor className="w-4 h-4 text-blue-500" />
                    Онлайн занятия
                  </div>
                )}
                {tutor.is_home && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Home className="w-4 h-4 text-emerald-500" />
                    Офлайн/Выезд на дом
                  </div>
                )}
                {tutor.district && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {tutor.district}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
