import { createClient } from '@supabase/supabase-js';

// We use environment variables for Supabase credentials.
// In Vite, these are prefixed with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
