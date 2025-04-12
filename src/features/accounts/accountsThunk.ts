import {createAsyncThunk} from '@reduxjs/toolkit';
import {supabase} from '../../services/supbaseClient';
import {Database} from '../../../database.types';

type Account = Database['public']['Tables']['accounts']['Row'];
type NewAccount = Database['public']['Tables']['accounts']['Insert'];
type UpdateAccount = Database['public']['Tables']['accounts']['Update'];

export const fetchAllAccountsThunk = createAsyncThunk<
  Account[],
  string | null,
  {rejectValue: string}
>('accounts/fetchAll', async (userId, {rejectWithValue}) => {
  // select all the categories with user_id or where user_id is null
  // null user_id specifies the default categories
  const {data, error} = await supabase
    .from('accounts')
    .select('*')
    // .or(`user_id.eq.${userId},user_id.is.null`)
    .order('created_at', {ascending: true});
  if (error) {
    return rejectWithValue(error.message);
  }

  return data ?? [];
});

export const addAccountThunk = createAsyncThunk<
  NewAccount,
  {name: string; user_id: string},
  {rejectValue: string}
>('accounts/add', async ({name, user_id}, {rejectWithValue}) => {
  const {data, error} = await supabase
    .from('accounts')
    .insert([{name, user_id}])
    .select()
    .single();

  if (error) {
    return rejectWithValue(error.message);
  }

  return data;
});

export const updateAccountThunk = createAsyncThunk<
  UpdateAccount,
  {id: string; updates: UpdateAccount},
  {rejectValue: string}
>('accounts/update', async ({id, updates}, {rejectWithValue}) => {
  const {data, error} = await supabase
    .from('accounts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return rejectWithValue(error.message);
  }
  return data;
});

export const deleteAccountThunk = createAsyncThunk<
  string,
  string,
  {rejectValue: string}
>('accounts/delete', async (accountId, {rejectWithValue}) => {
  const {error} = await supabase.from('accounts').delete().eq('id', accountId);

  if (error) {
    return rejectWithValue(error.message);
  }
  return accountId;
});
