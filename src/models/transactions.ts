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
    .order('transaction_time', {ascending: false});

  return {data, error};
};

// Fetch transactions for a specific date
export const fetchTransactionsByDate = async (
  userId: string,
  specificDate: string,
): Promise<{
  data: EnrichedTransaction[] | null;
  error: PostgrestError | null;
}> => {
  const startOfDay = `${specificDate}T00:00:00Z`;
  const endOfDay = `${specificDate}T23:59:59Z`;

  console.log('ByDate', specificDate, startOfDay, endOfDay);
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
    .gte('transaction_time', startOfDay)
    .lte('transaction_time', endOfDay)
    .order('transaction_time', {ascending: false}); // Most recent first

  return {data, error};
};

// Fetch transactions within a date range
export const fetchTransactionsByDateRange = async (
  userId: string,
  startDate: string,
  endDate: string,
): Promise<{
  data: EnrichedTransaction[] | null;
  error: PostgrestError | null;
}> => {
  const startDateTime = `${startDate}T00:00:00Z`;
  const endDateTime = `${endDate}T23:59:59Z`;

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
    .gte('transaction_time', startDateTime)
    .lte('transaction_time', endDateTime)
    .order('transaction_time', {ascending: false}); // Most recent first

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
