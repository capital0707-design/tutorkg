import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(https://gbcjbslclauymjccekbr.supabase.co, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_dsJ6MgWUbGskTjWvxcg3Uw_pQKZ0E_a);
