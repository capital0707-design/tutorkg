export interface SubjectCategory {
  id: string;
  name: string;
  name_en: string;
  sort_order: number;
}

export interface Subject {
  id: string;
  category_id: string;
  name: string;
  name_en: string;
  sort_order: number;
  category?: SubjectCategory;
}

export interface TutorProfile {
  id: string;
  full_name: string;
  bio: string;
  phone: string;
  district: string;
  experience_years: number;
  price_per_hour: number;
  photo_url: string;
  is_online: boolean;
  is_home: boolean;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  subjects?: Subject[];
}

export interface SearchFilters {
  subject_id: string;
  district: string;
  price_max: number;
  is_online: boolean | null;
  is_home: boolean | null;
}

export const BISHKEK_DISTRICTS = [
  'Октябрьский район',
  'Свердловский район',
  'Первомайский район',
  'Ленинский район',
  'Верхние микрорайоны',
  'Асанбай',
  'Арча-Бешик',
  'Джал',
  'Кара-Жигач',
  'Восток-5',
];
