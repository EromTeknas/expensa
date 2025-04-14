import {Database} from '../../database.types';
import {supabase} from '../services/supbaseClient';
import {Account} from './accounts';
import {Category} from './categories';
import {PostgrestError} from '@supabase/supabase-js';

export type Expense = Database['public']['Tables']['expenses']['Row'];
export type EnrichedExpense = Omit<Expense, 'account_id' | 'category_id'> & {
  account: Account;
  category: Category;
};
export type NewExpense = Database['public']['Tables']['expenses']['Insert'];

export const fetchAllExpenses = async (
  userId: string,
): Promise<{
  data: EnrichedExpense[] | null;
  error: PostgrestError | null;
}> => {
  const {data, error} = await supabase
    .from('expenses')
    .select(
      `
  *,
  account:account_id ( id, name ),
  category:category_id ( id, name )
`,
    )
    .eq('user_id', userId)
    .order('created_at', {ascending: true});

  return {data, error};
};

export const addExpense = async (expense: NewExpense) => {
  const {data, error} = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single();

  return {data, error};
};
