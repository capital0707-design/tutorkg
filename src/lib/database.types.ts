export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      subject_categories: {
        Row: {
          id: string;
          name: string;
          name_en: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_en: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_en?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          name_en: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          name_en: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          name_en?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      tutor_profiles: {
        Row: {
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
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          bio?: string;
          phone?: string;
          district?: string;
          experience_years?: number;
          price_per_hour?: number;
          photo_url?: string;
          is_online?: boolean;
          is_home?: boolean;
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          bio?: string;
          phone?: string;
          district?: string;
          experience_years?: number;
          price_per_hour?: number;
          photo_url?: string;
          is_online?: boolean;
          is_home?: boolean;
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tutor_subjects: {
        Row: {
          id: string;
          tutor_id: string;
          subject_id: string;
        };
        Insert: {
          id?: string;
          tutor_id: string;
          subject_id: string;
        };
        Update: {
          id?: string;
          tutor_id?: string;
          subject_id?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
