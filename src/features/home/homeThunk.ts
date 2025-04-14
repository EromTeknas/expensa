import {createAsyncThunk} from '@reduxjs/toolkit';
import {Database} from '../../../database.types';
import {supabase} from '../../services/supbaseClient';
type Category = Database['public']['Tables']['categories']['Row'];
type Account = Database['public']['Tables']['categories']['Row'];
type Expense = Database['public']['Tables']['expenses']['Row'];
type EnrichedExpense = Omit<Expense, 'account_id' | 'category_id'> & {
  account: Account;
  category: Category;
};

export const fetchAllCategoriesThunk = createAsyncThunk<
  Category[],
  string | null,
  {rejectValue: string}
>('home/fetchAllCategories', async (userId, {rejectWithValue}) => {
  // select all the categories with user_id or where user_id is null
  // null user_id specifies the default categories
  const {data, error} = await supabase
    .from('categories')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order('created_at', {ascending: true});
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
  // select all the categories with user_id or where user_id is null
  // null user_id specifies the default categories
  const {data, error} = await supabase
    .from('accounts')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order('created_at', {ascending: true});
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

  console.log(data);
  if (error) {
    return rejectWithValue(error.message);
  }

  return data ?? [];
});

export const addExpenseThunk = createAsyncThunk<
  EnrichedExpense,
  {
    amount: string;
    description: string;
    user_id: string;
    category_id: string;
    account_id: string;
  },
  {rejectValue: string}
>(
  'home/addExpense',
  async (
    {amount, user_id, description, category_id, account_id},
    {rejectWithValue},
  ) => {
    const expense = [amount, user_id, description, category_id, account_id];
    console.log(expense);
    const {data, error} = await supabase
      .from('expenses')
      .insert([{amount, user_id, description, category_id, account_id}])
      .select()
      .single();

    if (error) {
      console.log('add error', error);
      return rejectWithValue(error.message);
    }

    // After insert, fetch the full `account` and `category` data
    const {data: enrichedExpense, error: fetchError} = await supabase
      .from('expenses')
      .select(
        `
      *,
      account:account_id ( id, name ),
      category:category_id ( id, name )
      `,
      )
      .eq('id', data?.id) // Fetch the inserted record by ID
      .single();

    if (fetchError) {
      console.log('fetch error', fetchError);

      return rejectWithValue(fetchError.message);
    }

    return enrichedExpense;
  },
);
