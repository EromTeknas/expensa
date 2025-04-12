import {createAsyncThunk} from '@reduxjs/toolkit';
import {supabase} from '../../services/supbaseClient';
import {Database} from '../../../database.types';
type Category = Database['public']['Tables']['categories']['Row'];
type Account = Database['public']['Tables']['categories']['Row'];

type Expense = Database['public']['Tables']['expenses']['Row'];
// type NewExpense = Database['public']['Tables']['expenses']['Insert'];
// type UpdateExpense = Database['public']['Tables']['expenses']['Update'];
type EnrichedExpense = Omit<Expense, 'account_id' | 'category_id'> & {
  account: Account;
  category: Category;
};

export const fetchAllExpensesThunk = createAsyncThunk<
  EnrichedExpense[],
  string | null,
  {rejectValue: string}
>('expenses/fetchAll', async (userId, {rejectWithValue}) => {
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
  'expenses/add',
  async (
    {amount, user_id, description, category_id, account_id},
    {rejectWithValue},
  ) => {
    const {data, error} = await supabase
      .from('expenses')
      .insert([{amount, user_id, description, category_id, account_id}])
      .select()
      .single();

    if (error) {
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
      return rejectWithValue(fetchError.message);
    }

    return enrichedExpense;
  },
);
