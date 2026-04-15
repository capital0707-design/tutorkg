import { MapPin, Clock, Monitor, Home, CheckCircle, Star } from 'lucide-react';
import type { TutorProfile } from '../lib/types';

interface TutorCardProps {
  tutor: TutorProfile;
  onView: (id: string) => void;
}

export default function TutorCard({ tutor, onView }: TutorCardProps) {
  const initials = tutor.full_name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden cursor-pointer group"
      onClick={() => onView(tutor.id)}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 relative">
            {tutor.photo_url ? (
              <img
                src={tutor.photo_url}
                alt={tutor.full_name}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                {initials || '?'}
              </div>
            )}
            {tutor.is_verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {tutor.full_name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-gray-500">Новый репетитор</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-blue-600">
                  {tutor.price_per_hour > 0 ? `${tutor.price_per_hour.toLocaleString()} сом` : 'По договору'}
                </div>
                {tutor.price_per_hour > 0 && (
                  <div className="text-xs text-gray-400">за час</div>
                )}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {tutor.experience_years > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  <Clock className="w-3 h-3" />
                  {tutor.experience_years} {tutor.experience_years === 1 ? 'год' : tutor.experience_years < 5 ? 'года' : 'лет'} опыта
                </span>
              )}
              {tutor.district && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  <MapPin className="w-3 h-3" />
                  {tutor.district}
                </span>
              )}
              {tutor.is_online && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                  <Monitor className="w-3 h-3" />
                  Онлайн
                </span>
              )}
              {tutor.is_home && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-xs">
                  <Home className="w-3 h-3" />
                  Офлайн/Выезд на дом
                </span>
              )}
            </div>
          </div>
        </div>

        {tutor.bio && (
          <p className="mt-3 text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {tutor.bio}
          </p>
        )}

        {tutor.subjects && tutor.subjects.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tutor.subjects.slice(0, 4).map((subject) => (
              <span
                key={subject.id}
                className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
              >
                {subject.name}
              </span>
            ))}
            {tutor.subjects.length > 4 && (
              <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-medium">
                +{tutor.subjects.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <button
          onClick={(e) => { e.stopPropagation(); onView(tutor.id); }}
          className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Посмотреть профиль →
        </button>
      </div>
    </div>
  );
}
