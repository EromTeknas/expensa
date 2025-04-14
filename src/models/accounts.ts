import {Database} from '../../database.types';
import {supabase} from '../services/supbaseClient';

export type Account = Database['public']['Tables']['categories']['Row'];

export const fetchAllAccounts = async (userId: string) => {
  const {data, error} = await supabase
    .from('accounts')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order('created_at', {ascending: true});

  return {data, error};
};
