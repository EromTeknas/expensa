import {createAsyncThunk} from '@reduxjs/toolkit';
import {Category, fetchAllCategories} from '../../models/categories';
import {Account, fetchAllAccounts} from '../../models/accounts';
import {
  addTransaction,
  EnrichedTransaction,
  fetchAllTransactions,
  NewTransaction,
} from '../../models/transactions';

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

// Fetch all transactions for a user
export const fetchAllTransactionsThunk = createAsyncThunk<
  EnrichedTransaction[],
  string | null,
  {rejectValue: string}
>('home/fetchAllTransactions', async (userId, {rejectWithValue}) => {
  const {data, error} = await fetchAllTransactions(userId!);

  if (error) {
    return rejectWithValue(error.message);
  }

  return data ?? [];
});

// Add a transaction and refetch the full list
export const addTransactionThunk = createAsyncThunk<
  EnrichedTransaction[],
  NewTransaction,
  {rejectValue: string}
>(
  'home/addTransaction',
  async (newTransaction: NewTransaction, {rejectWithValue}) => {
    const {error: addError} = await addTransaction(newTransaction);

    if (addError) {
      return rejectWithValue(addError.message ?? 'Failed to add transaction');
    }

    // Fetch updated transactions after insert
    const {data: allTransactionsData, error: fetchError} =
      await fetchAllTransactions(newTransaction.user_id);

    if (fetchError) {
      return rejectWithValue(fetchError.message);
    }

    return allTransactionsData ?? [];
  },
);
