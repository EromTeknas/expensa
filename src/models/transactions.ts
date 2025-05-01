import {Database} from '../../database.types';
import {supabase} from '../services/supbaseClient';
import {Account} from './accounts';
import {Category} from './categories';
import {PostgrestError} from '@supabase/supabase-js';

export type TransactionType = Database['public']['Enums']['transaction_type'];

export const TRANSACTION_TYPE: Record<'CREDIT' | 'DEBIT', TransactionType> = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
};
// Raw table row type
export type Transaction = Database['public']['Tables']['transactions']['Row'];

// Input type for insert
export type NewTransaction =
  Database['public']['Tables']['transactions']['Insert'];

// Enriched type with account and category populated
export type EnrichedTransaction = Omit<
  Transaction,
  'account_id' | 'category_id'
> & {
  account: Account;
  category: Category;
};

// Fetch all transactions for a user
export const fetchAllTransactions = async (
  userId: string,
): Promise<{
  data: EnrichedTransaction[] | null;
  error: PostgrestError | null;
}> => {
  const {data, error} = await supabase
    .from('transactions')
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

// Add a new transaction
export const addTransaction = async (transaction: NewTransaction) => {
  const {data, error} = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();

  return {data, error};
};
