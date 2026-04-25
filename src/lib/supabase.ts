import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jtqatpaaqbtwprkvpktk.supabase.co';
const supabaseAnonKey = 'sb_publishable_dsJ6MgWUbGskTjWvxcg3Uw_pQKZ0E_a';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// src/lib/supabase.ts
export const getTutors = async () => {
  const { data, error } = await supabase
    .from('tutors') // Убедитесь, что таблица называется именно так
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
