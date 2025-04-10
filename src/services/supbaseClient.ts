import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl: string = 'https://cdwgsbzctskztjcrucuv.supabase.co';
const supabaseAnonKey: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkd2dzYnpjdHNrenRqY3J1Y3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MTYyOTgsImV4cCI6MjA1ODI5MjI5OH0.gKNRiWzdd4diFWot2c00ihkVsFYtox-YeBxEbdgf00w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
