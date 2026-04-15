import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, CheckCircle, Plus, X, ChevronDown, User, Phone, MapPin, Clock, Monitor, Home, DollarSign, FileText, Video, Calendar, CreditCard as Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SubjectCategory, Subject } from '../lib/types';
import { BISHKEK_DISTRICTS } from '../lib/types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface DashboardProps {
  user: SupabaseUser;
}

interface FormData {
  full_name: string;
  bio: string;
  phone: string;
  district: string;
  experience_years: number;
  price_per_hour: number;
  photo_url: string;
  is_online: boolean;
  is_home: boolean;
}

interface Session {
  id: string;
  room_name: string;
  title: string;
  scheduled_at: string;
  status: string;
  student_id: string;
}

export default function Dashboard({ user }: DashboardProps) {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    bio: '',
    phone: '',
    district: '',
    experience_years: 0,
    price_per_hour: 0,
    photo_url: '',
    is_online: true,
    is_home: false,
  });
  const [categories, setCategories] = useState<SubjectCategory[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [mySubjectIds, setMySubjectIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'sessions'>('profile');
  const [showNewSession, setShowNewSession] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    studentId: '',
    scheduledAt: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, categoriesRes, subjectsRes, tutorSubjectsRes, sessionsRes] = await Promise.all([
        supabase.from('tutor_profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('subject_categories').select('*').order('sort_order'),
        supabase.from('subjects').select('*').order('sort_order'),
        supabase.from('tutor_subjects').select('subject_id').eq('tutor_id', user.id),
        supabase.from('sessions').select('*').eq('tutor_id', user.id).order('scheduled_at', { ascending: false }),
      ]);

      if (profileRes.data) {
        const p = profileRes.data;
        setFormData({
          full_name: p.full_name || '',
          bio: p.bio || '',
          phone: p.phone || '',
          district: p.district || '',
          experience_years: p.experience_years || 0,
          price_per_hour: p.price_per_hour || 0,
          photo_url: p.photo_url || '',
          is_online: p.is_online ?? true,
          is_home: p.is_home ?? false,
        });
      }
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (subjectsRes.data) setAllSubjects(subjectsRes.data);
      if (tutorSubjectsRes.data) {
        setMySubjectIds(tutorSubjectsRes.data.map((ts) => ts.subject_id));
      }
      if (sessionsRes.data) setSessions(sessionsRes.data);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredSubjects(allSubjects.filter((s) => s.category_id === selectedCategory));
    } else {
      setFilteredSubjects([]);
    }
  }, [selectedCategory, allSubjects]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('tutor_profiles')
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubject = async (subjectId: string) => {
    if (mySubjectIds.includes(subjectId)) return;
    const { error } = await supabase
      .from('tutor_subjects')
      .insert({ tutor_id: user.id, subject_id: subjectId });
    if (!error) {
      setMySubjectIds((prev) => [...prev, subjectId]);
    }
  };

  const handleRemoveSubject = async (subjectId: string) => {
    const { error } = await supabase
      .from('tutor_subjects')
      .delete()
      .eq('tutor_id', user.id)
      .eq('subject_id', subjectId);
    if (!error) {
      setMySubjectIds((prev) => prev.filter((id) => id !== subjectId));
    }
  };

  const generateRoomName = () => {
    return `tutoring-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSession.title || !newSession.studentId || !newSession.scheduledAt) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const roomName = generateRoomName();
      const { error } = await supabase.from('sessions').insert({
        tutor_id: user.id,
        student_id: newSession.studentId,
        room_name: roomName,
        title: newSession.title,
        scheduled_at: new Date(newSession.scheduledAt).toISOString(),
        status: 'scheduled',
      });

      if (error) throw error;

      setNewSession({ title: '', studentId: '', scheduledAt: '' });
      setShowNewSession(false);
      fetchData();
    } catch (err) {
      console.error('Error creating session:', err);
      alert('Ошибка при создании встречи');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту встречу?')) return;

    try {
      const { error } = await supabase.from('sessions').delete().eq('id', sessionId);

      if (error) throw error;
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      console.error('Error deleting session:', err);
      alert('Ошибка при удалении встречи');
    }
  };

  const getMeetingLink = (sessionId: string) => {
    return `${window.location.origin}?session=${sessionId}`;
  };

  const mySubjects = allSubjects.filter((s) => mySubjectIds.includes(s.id));

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';

    let digits = cleaned;
    if (digits.length > 0 && !digits.startsWith('996')) {
      digits = '996' + digits;
    }
    digits = digits.slice(0, 12);

    if (digits.length <= 3) return '+' + digits;
    if (digits.length <= 6) return '+' + digits.slice(0, 3) + ' ' + digits.slice(3);
    if (digits.length <= 9) return '+' + digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6);
    return '+' + digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6, 9) + ' ' + digits.slice(9, 12);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((p) => ({ ...p, phone: formatted }));
  };

  const field = (
    label: string,
    icon: React.ReactNode,
    input: React.ReactNode
  ) => (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
        {icon}
        {label}
      </label>
      {input}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Мой кабинет</h1>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          <div className="flex gap-4 mt-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Мой профиль
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'sessions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Video className="w-4 h-4" />
              Встречи ({sessions.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {activeTab === 'profile' && (
        <div className="space-y-6">
        <form onSubmit={handleSave}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-800 text-lg">Основная информация</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {field(
                'Полное имя',
                <User className="w-4 h-4 text-gray-400" />,
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
                  placeholder="Иванов Иван Иванович"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              {field(
                'Телефон',
                <Phone className="w-4 h-4 text-gray-400" />,
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+996 700 000 000"
                  maxLength={17}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              )}
              {field(
                'Район Бишкека',
                <MapPin className="w-4 h-4 text-gray-400" />,
                <div className="relative">
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData((p) => ({ ...p, district: e.target.value }))}
                    className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="">Выберите район</option>
                    {BISHKEK_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              )}
              {field(
                'Опыт работы (лет)',
                <Clock className="w-4 h-4 text-gray-400" />,
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={formData.experience_years || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, experience_years: Number(e.target.value) }))}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              {field(
                'Цена за час (сом)',
                <DollarSign className="w-4 h-4 text-gray-400" />,
                <input
                  type="number"
                  min={0}
                  value={formData.price_per_hour || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, price_per_hour: Number(e.target.value) }))}
                  placeholder="500"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              {field(
                'Ссылка на фото',
                <User className="w-4 h-4 text-gray-400" />,
                <input
                  type="url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData((p) => ({ ...p, photo_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <FileText className="w-4 h-4 text-gray-400" />
                О себе
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                rows={4}
                placeholder="Расскажите о своём опыте, методах преподавания, достижениях учеников..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Формат занятий</label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_online}
                    onChange={(e) => setFormData((p) => ({ ...p, is_online: e.target.checked }))}
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
                    checked={formData.is_home}
                    onChange={(e) => setFormData((p) => ({ ...p, is_home: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="flex items-center gap-1.5 text-sm text-gray-700">
                    <Home className="w-4 h-4 text-emerald-500" />
                    Офлайн/Выезд на дом
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saved ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Сохраняем...' : saved ? 'Сохранено!' : 'Сохранить изменения'}
              </button>
            </div>
          </div>
        </form>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 text-lg mb-4">Мои предметы</h2>

          {mySubjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {mySubjects.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium"
                >
                  {s.name}
                  <button
                    onClick={() => handleRemoveSubject(s.id)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {selectedCategory && filteredSubjects.length > 0 && (
              <div className="relative">
                <select
                  defaultValue=""
                  onChange={(e) => { if (e.target.value) handleAddSubject(e.target.value); e.target.value = ''; }}
                  className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="">Добавить предмет...</option>
                  {filteredSubjects
                    .filter((s) => !mySubjectIds.includes(s.id))
                    .map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
                <Plus className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>
        </div>
        </div>
        )}

        {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Мои встречи</h2>
            <button
              onClick={() => setShowNewSession(!showNewSession)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Новая встреча
            </button>
          </div>

          {showNewSession && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Создать встречу</h3>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Название встречи
                  </label>
                  <input
                    type="text"
                    value={newSession.title}
                    onChange={(e) => setNewSession((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Математика - Уроки"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    ID студента
                  </label>
                  <input
                    type="text"
                    value={newSession.studentId}
                    onChange={(e) => setNewSession((p) => ({ ...p, studentId: e.target.value }))}
                    placeholder="UUID студента"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Время встречи
                  </label>
                  <input
                    type="datetime-local"
                    value={newSession.scheduledAt}
                    onChange={(e) => setNewSession((p) => ({ ...p, scheduledAt: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
                  >
                    Создать встречу
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewSession(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold text-sm transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          )}

          {sessions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Встреч еще нет</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{session.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.scheduled_at).toLocaleString('ru-RU')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          session.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          session.status === 'in_progress' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {session.status === 'scheduled' ? 'Запланирована' :
                           session.status === 'in_progress' ? 'В процессе' : 'Завершена'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const link = getMeetingLink(session.id);
                          navigator.clipboard.writeText(link);
                          alert('Ссылка скопирована!');
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Копировать ссылку"
                      >
                        <Edit2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
