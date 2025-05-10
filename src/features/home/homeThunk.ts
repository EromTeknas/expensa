import {createAsyncThunk} from '@reduxjs/toolkit';
import {Category, fetchAllCategories} from '../../models/categories';
import {Account, fetchAllAccounts} from '../../models/accounts';
import {
  addTransaction,
  EnrichedTransaction,
  fetchAllTransactions,
  fetchTransactionsByDate,
  fetchTransactionsByDateRange,
  NewTransaction,
} from '../../models/transactions';
import {PostgrestError} from '@supabase/supabase-js';

export const fetchAllCategoriesThunk = createAsyncThunk<
  Category[],
  string | null,
  {rejectValue: string}
>('home/fetchAllCategories', async (userId, {rejectWithValue}) => {
  const {data, error} = await fetchAllCategories(userId!);

  if (error) {
    return rejectWithValue(error.message);
  }

  return data ?? [];
});

export const fetchAllAccountsThunk = createAsyncThunk<
  Account[],
  string | null,
  {rejectValue: string}
>('home/fetchAllAccounts', async (userId, {rejectWithValue}) => {
  const {data, error} = await fetchAllAccounts(userId!);
  if (error) {
    return rejectWithValue(error.message);
  }

  return data ?? [];
});

// Updated thunk to fetch transactions based on user input
export const fetchAllTransactionsThunk = createAsyncThunk<
  EnrichedTransaction[],
  {
    userId: string;
    date?: string; // Specific date (YYYY-MM-DD)
    startDate?: string; // Start date for a range (YYYY-MM-DD)
    endDate?: string; // End date for a range (YYYY-MM-DD)
  },
  {rejectValue: string}
>(
  'home/fetchAllTransactions',
  async ({userId, date, startDate, endDate}, {rejectWithValue}) => {
    try {
      let data: EnrichedTransaction[] | null = null;
      let error: PostgrestError | null = null;

      // Check for specific date
      if (date) {
        console.log('specific Date');
        ({data, error} = await fetchTransactionsByDate(userId, date));
      }
      // Check for date range
      else if (startDate && endDate) {
        console.log('Date Range');
        ({data, error} = await fetchTransactionsByDateRange(
          userId,
          startDate,
          endDate,
        ));
      }
      // Fetch all transactions if no date or range is specified
      else {
        console.log('All Transactions');
        ({data, error} = await fetchAllTransactions(userId));
      }

      if (error) {
        console.log(error);
        return rejectWithValue(error.message);
      }

      return data ?? [];
    } catch (err) {
      console.log(err);
      return rejectWithValue('Failed to fetch transactions.');
    }
  },
);

// Add a transaction and refetch the specified list
export const addTransactionThunk = createAsyncThunk<
  EnrichedTransaction[],
  {
    newTransaction: NewTransaction;
    fetchOptions?: {
      date?: string; // Specific date (YYYY-MM-DD)
      startDate?: string; // Start date for a range (YYYY-MM-DD)
      endDate?: string; // End date for a range (YYYY-MM-DD)
    };
  },
  {rejectValue: string}
>(
  'home/addTransaction',
  async ({newTransaction, fetchOptions}, {rejectWithValue}) => {
    console.log('newtran', newTransaction);
    console.log('fetch options', fetchOptions);
    // Add the transaction
    const {error: addError} = await addTransaction(newTransaction);

    if (addError) {
      console.log(addError);
      return rejectWithValue(addError.message ?? 'Failed to add transaction');
    }

    let data: EnrichedTransaction[] | null = null;
    let error: PostgrestError | null = null;

    // Check for specific date
    if (fetchOptions?.date) {
      console.log('specific Date');
      ({data, error} = await fetchTransactionsByDate(
        newTransaction.user_id,
        fetchOptions.date,
      ));
    }
    // Check for date range
    else if (fetchOptions?.startDate && fetchOptions.endDate) {
      console.log('Date Range');
      ({data, error} = await fetchTransactionsByDateRange(
        newTransaction.user_id,
        fetchOptions.startDate,
        fetchOptions.endDate,
      ));
    }
    // Fetch all transactions if no date or range is specified
    else {
      console.log('All Transactions');
      ({data, error} = await fetchAllTransactions(newTransaction.user_id));
    }

    if (error) {
      return rejectWithValue(error.message ?? 'Failed to fetch transactions');
    }

    return data ?? [];
  },
);
