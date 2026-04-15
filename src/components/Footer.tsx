import { BookOpen, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">Репетитор</span>
                <span className="text-lg font-bold text-blue-400">Бишкек</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Платформа для поиска профессиональных репетиторов в Бишкеке. Найдите лучшего преподавателя для Вашего ребёнка или себя.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                Бишкек, Кыргызстан
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                +996 700 240 524
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                info@repetitorbishkek.kg
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Навигация</h3>
            <ul className="space-y-2">
              {[
                { label: 'Главная', page: 'home' },
                { label: 'Каталог репетиторов', page: 'catalog' },
                { label: 'Стать репетитором', page: 'register' },
              ].map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Предметы</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Английский язык</li>
              <li>Математика</li>
              <li>Физика</li>
              <li>Химия</li>
              <li>Программирование</li>
              <li>Подготовка к ОРТ</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
          Copyright © 2026 TutorsBishkek. Все права защищены.
          </p>
          <p className="text-xs text-gray-500">
            Бишкек, Кыргызстан
          </p>
        </div>
      </div>
    </footer>
  );
}
