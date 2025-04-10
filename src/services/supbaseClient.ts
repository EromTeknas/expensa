import 'react-native-url-polyfill/auto'
import {createClient} from '@supabase/supabase-js';

const supabaseUrl: string = '__REMOVED__';
const supabaseAnonKey: string =
  '__REMOVED__';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
