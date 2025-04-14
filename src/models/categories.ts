import {Database} from '../../database.types';
import {supabase} from '../services/supbaseClient';

export type Category = Database['public']['Tables']['categories']['Row'];

export const fetchAllCategories = async (userId: string) => {
  // select all the categories with user_id or where user_id is null
  // null user_id specifies the default categories
  const {data, error} = await supabase
    .from('categories')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order('created_at', {ascending: true});

  return {data, error};
};
