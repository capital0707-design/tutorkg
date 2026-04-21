
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Monitor, Home, CheckCircle, Phone, Star, Loader2, AlertCircle } from 'lucide-react';
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
                subject_categories ( id, name )
              )
            )
          `)
          .eq('id', tutorId)
          .maybeSingle();

        if (err) throw err;
        if (!data) {
          setError('Репетитор не найден');
          return;
        }

        const subjects = (data.tutor_subjects || [])
          .map((ts: any) => ({
            ...ts.subjects,
            category: ts.subjects?.subject_categories
          }))
          .filter((s: any) => s.id);

        setTutor({ ...data, subjects });
      } catch (err) {
        console.error(err);
        setError('Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [tutorId]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  if (error || !tutor) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
      <div>
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={onBack} className="text-blue-600 hover:underline">Назад к каталогу</button>
      </div>
    </div>
  );

  const initials = tutor.full_name.split(' ').map(n => n[0]).join('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-5xl mx-auto px-4">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm">
            <ArrowLeft className="w-4 h-4" /> Назад
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-5">
                <div className="w-24 h-24 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {initials}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{tutor.full_name}</h1>
                  <div className="text-xl font-bold text-blue-600 mt-1">{tutor.price_per_hour} сом/час</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tutor.experience_years > 0 && <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{tutor.experience_years} лет опыта</span>}
                    {tutor.district && <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{tutor.district}</span>}
                  </div>
                </div>
              </div>
              {tutor.bio && <div className="mt-6 pt-6 border-t border-gray-100"><p className="text-gray-600">{tutor.bio}</p></div>}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit sticky top-6">
            <h2 className="font-semibold mb-4">Связаться</h2>
            {tutor.phone && (
              <a href={`https://wa.me{tutor.phone.replace(/\D/g, '')}`} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
