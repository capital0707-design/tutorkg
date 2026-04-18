import { BookOpen, Users, CheckCircle, Star, ArrowRight, Monitor, Home as HomeIcon, Award } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import type { SearchFilters } from '../lib/types';

interface HomeProps {
  onNavigate: (page: string, data?: unknown) => void;
  onSearch: (filters: SearchFilters) => void;
}

const STATS = [
  { value: '50+', label: 'Репетиторов' },
  { value: '200+', label: 'Учеников' },
  { value: '12+', label: 'Предметов' },
  { value: '4.8', label: 'Средний рейтинг' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Выберите предмет',
    desc: 'Укажите предмет или категорию, по которой нужна помощь',
    icon: BookOpen,
  },
  {
    step: '02',
    title: 'Найдите репетитора',
    desc: 'Просмотрите профили и выберите подходящего специалиста',
    icon: Users,
  },
  {
    step: '03',
    title: 'Начните занятия',
    desc: 'Свяжитесь с репетитором и договоритесь об удобном времени',
    icon: CheckCircle,
  },
];

const POPULAR_SUBJECTS = [
  { name: 'Английский язык', icon: '🇬🇧', count: 7 },
  { name: 'Математика', icon: '📐', count: 6 },
  { name: 'Физика', icon: '⚡', count: 8 },
  { name: 'Программирование', icon: '💻', count: 12 },
  { name: 'Подготовка к ОРТ', icon: '📝', count: 5 },
  { name: 'Химия', icon: '🧪', count: 5 },
  { name: 'Немецкий язык', icon: '🇩🇪', count: 6 },
  { name: 'История', icon: '📚', count: 7 },
];

const FEATURES = [
  {
    icon: Monitor,
    title: 'Онлайн занятия 
      Встроенная видео платформа',
    desc: 'Занимайтесь с лучшими репетиторами',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: HomeIcon,
    title: 'Офлайн/Выезд на дом',
    desc: 'Репетитор приедет к Вам домой в удобное время',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Award,
    title: 'Проверенные репетиторы',
    desc: 'Все профили проходят верификацию для Вашей безопасности',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Star,
    title: 'Рейтинг и отзывы',
    desc: 'Читайте отзывы других учеников перед выбором репетитора',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
];

export default function Home({ onNavigate, onSearch }: HomeProps) {
  const handleSearch = (filters: SearchFilters) => {
    onSearch(filters);
    onNavigate('catalog');
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Бишкек — лучшие репетиторы рядом с Вами
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Найди лучшего
              <span className="block text-blue-200">репетитора</span>
              в Бишкеке
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-xl">
              Более 50 проверенных репетиторов по всем предметам. Онлайн или Офлайн с выездом на дом — выбор за Вами.
            </p>
          </div>

          <div className="max-w-3xl">
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Популярные предметы</h2>
            <p className="text-gray-500">Найдите репетитора по любому предмету</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {POPULAR_SUBJECTS.map((subject) => (
              <button
                key={subject.name}
                onClick={() => onNavigate('catalog')}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 text-left group"
              >
                <span className="text-2xl">{subject.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {subject.name}
                  </div>
                  <div className="text-xs text-gray-400">{subject.count} репетиторов</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Как это работает</h2>
            <p className="text-gray-500">Три простых шага к знаниям</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-2xl text-xl font-bold mb-4 shadow-lg shadow-blue-100">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Почему выбирают нас</h2>
            <p className="text-gray-500">Всё что нужно для качественного обучения</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${f.bg} rounded-xl mb-4`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Вы репетитор?
          </h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
            Зарегистрируйтесь на нашей платформе и начните получать учеников уже сегодня
          </p>
          <button
            onClick={() => onNavigate('register')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Зарегистрироваться как репетитор
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
