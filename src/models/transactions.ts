import {Database} from '../../database.types';
import {supabase} from '../services/supbaseClient';
import {Account} from './accounts';
import {Category} from './categories';
import {PostgrestError, PostgrestSingleResponse} from '@supabase/supabase-js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {getStartAndEndOfDayInUTC} from '../utils/dateTimeUtilities';
import {WMNewTransactionInput} from '../watermelon/services/transactionService';

dayjs.extend(utc);
dayjs.extend(timezone);
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
  // Convert specificDate to UTC start and end times
  const {start: startOfDay, end: endOfDay} = getStartAndEndOfDayInUTC({
    date: specificDate,
  });

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
  const {start: startDateTime, end: endDateTime} = getStartAndEndOfDayInUTC({
    startDate: startDate,
    endDate: endDate,
  });

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

export const fetchTransactionSum = async (
  userId: string,
  startDate: string,
): Promise<
  PostgrestSingleResponse<
    {
      sum: number;
    }[]
  >
> => {
  const sum = await supabase
    .from('transactions')
    .select('amount.sum()', {count: 'exact'}) // Proper aggregation
    .eq('user_id', userId)
    .gte('transaction_time', startDate);
  return sum;
};

// Add a new transaction
export const deleteTransaction = async (transactionId: string) => {
  const {error} = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId);

  console.log(error);
  return {error};
};

export async function addMultipleTransactions(
  transactions: NewTransaction[],
): Promise<{data: NewTransaction[]; error: PostgrestError | null}> {
  try {
    const {data, error} = await supabase
      .from('transactions')
      .insert(transactions);

    if (error) {
      console.error('Error inserting transactions:', error);
      return {data: [], error};
    }
    const trans = data ?? [];
    return {data: trans, error: null};
  } catch (err) {
    console.error('Unexpected error:', err);
    return {data: [], error: err as PostgrestError};
  }
}

export const fetchEnrichedTransactionsByIds = async (
  transactionIds: string[],
): Promise<{
  data: EnrichedTransaction[];
  error: PostgrestError | null;
}> => {
  if (transactionIds.length === 0) {
    return {data: [], error: null};
  }
  try {
    const {data, error} = await supabase
      .from('transactions')
      .select(
        `
      *,
      account:account_id ( id, name ),
      category:category_id ( id, name )
    `,
      )
      .in('id', transactionIds)
      .order('transaction_time', {ascending: false});

    if (error) {
      console.error('Error Fetching transactions:', error);
      return {data: [], error};
    }

    const trans: EnrichedTransaction[] = data ?? [];
    return {data: trans, error};
  } catch (err) {
    console.error('Unexpected error:', err);
    return {data: [], error: err as PostgrestError};
  }
};

export const checkIfHashesExist = async (
  hashes: string[],
): Promise<{
  existingHashes: string[];
  error: string | null;
}> => {
  try {
    const {data, error} = await supabase
      .from('hashes')
      .select('hash')
      .in('hash', hashes);

    if (error) {
      console.error('Failed to fetch existing hashes:', error.message);
      return {existingHashes: [], error: error.message};
    }

    const existingHashes = data?.map(item => item.hash) ?? [];

    return {existingHashes, error: null};
  } catch (err) {
    console.error('Unexpected error:', err);
    return {existingHashes: [], error: (err as Error).message};
  }
};

export const mapWMTransactionToNewTransaction = (
  wmTran: WMNewTransactionInput,
  user_id: string,
): NewTransaction => {
  return {
    account_id: wmTran.account_id ?? '',
    amount: wmTran.amount ?? 0,
    category_id: wmTran.category_id ?? '',
    description: wmTran.description ?? null,
    hash: wmTran.hash ?? null,
    transaction_time: new Date(wmTran.transactionTime).toISOString(),
    type: wmTran.type ?? 'DEBIT',
    user_id,
  };
};
export const mapWMTransactionsToNewTransactions = (
  wmTransactions: WMNewTransactionInput[],
  user_id: string,
): NewTransaction[] => {
  return wmTransactions.map(tran =>
    mapWMTransactionToNewTransaction(tran, user_id),
  );
};
