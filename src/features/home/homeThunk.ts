import {createAsyncThunk} from '@reduxjs/toolkit';
import {Category, fetchAllCategories} from '../../models/categories';
import {Account, fetchAllAccounts} from '../../models/accounts';
import {
  addExpense,
  EnrichedExpense,
  fetchAllExpenses,
  NewExpense,
} from '../../models/expenses';

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

export const fetchAllExpensesThunk = createAsyncThunk<
  EnrichedExpense[],
  string | null,
  {rejectValue: string}
>('home/fetchAllExpenses', async (userId, {rejectWithValue}) => {
  const {data, error} = await fetchAllExpenses(userId!);

  if (error) {
    return rejectWithValue(error.message);
  }

  return data ?? [];
});

export const addExpenseThunk = createAsyncThunk<
  EnrichedExpense[],
  NewExpense,
  {rejectValue: string}
>('home/addExpense', async (newExpense: NewExpense, {rejectWithValue}) => {
  const {error: addError} = await addExpense(newExpense);

  if (addError) {
    return rejectWithValue(addError.message ?? 'Failed to fetch expenses');
  }

  // After insert, fetch the full `account` and `category` data
  const {data: allExpensesData, error: fetchAllExpensesError} =
    await fetchAllExpenses(newExpense.user_id);
  if (fetchAllExpensesError) {
    return rejectWithValue(fetchAllExpensesError.message);
  }

  return allExpensesData ?? [];
});
