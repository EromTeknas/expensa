import {createAsyncThunk} from '@reduxjs/toolkit';
import {Category, fetchAllCategories} from '../../models/categories';
import {Account, fetchAllAccounts} from '../../models/accounts';
import {
  addTransaction,
  EnrichedTransaction,
  fetchAllTransactions,
  fetchTransactionsByDate,
  fetchTransactionsByDateRange,
  fetchTransactionSum,
  NewTransaction,
} from '../../models/transactions';
import {PostgrestError} from '@supabase/supabase-js';
import {
  getStartAndEndOfDayInUTC,
  getStartDate,
} from '../../utils/dateTimeUtilities';

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
        ({data, error} = await fetchTransactionsByDate(userId, date));
      }
      // Check for date range
      else if (startDate && endDate) {
        ({data, error} = await fetchTransactionsByDateRange(
          userId,
          startDate,
          endDate,
        ));
      }
      // Fetch all transactions if no date or range is specified
      else {
        ({data, error} = await fetchAllTransactions(userId));
      }

      if (error) {
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

export const fetchTransactionSumsThunk = createAsyncThunk<
  {weeklySum: number; monthlySum: number},
  string,
  {rejectValue: string}
>('home/fetchTransactionSums', async (userId, {rejectWithValue}) => {
  try {
    const {start: weekStart} = getStartAndEndOfDayInUTC({
      date: getStartDate('week'),
    });
    const {start: monthStart} = getStartAndEndOfDayInUTC({
      date: getStartDate('month'),
    });

    const {data: weeklySumData, error: weekError} = await fetchTransactionSum(
      userId,
      weekStart,
    );
    if (weekError) {
      throw new Error(weekError.message);
    }

    const {data: monthlySumData, error: monthError} = await fetchTransactionSum(
      userId,
      monthStart,
    );
    if (monthError) {
      throw new Error(monthError.message);
    }

    // Extract the sum value from the data
    const weeklySum = weeklySumData[0].sum ?? 0;
    const monthlySum = monthlySumData[0].sum ?? 0;

    console.log('Weekly', weeklySum);
    console.log('monthly', monthlySum);

    return {weeklySum, monthlySum};
  } catch (error) {
    console.log('sum error', error);
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Failed to fetch transaction sums',
    );
  }
});
