import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jtqatpaaqbtwprkvpktk.supabase.co';
const supabaseAnonKey = 'sb_publishable_dsJ6MgWUbGskTjWvxcg3Uw_pQKZ0E_a';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
