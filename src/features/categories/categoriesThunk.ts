import {createAsyncThunk} from '@reduxjs/toolkit';
import {supabase} from '../../services/supbaseClient';
import {Database} from '../../../database.types';

type Category = Database['public']['Tables']['categories']['Row'];
type NewCategory = Database['public']['Tables']['categories']['Insert'];
type UpdateCategory = Database['public']['Tables']['categories']['Update'];

export const fetchAllCategoriesThunk = createAsyncThunk<
  Category[],
  string | null,
  {rejectValue: string}
>('categories/fetchAll', async (userId, {rejectWithValue}) => {
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
  console.log(data);
  return data ?? [];
});

export const addCategoryThunk = createAsyncThunk<
  NewCategory,
  {name: string; user_id: string},
  {rejectValue: string}
>('categories/add', async ({name, user_id}, {rejectWithValue}) => {
  const {data, error} = await supabase
    .from('categories')
    .insert([{name, user_id}])
    .select()
    .single();

  if (error) {
    return rejectWithValue(error.message);
  }

  return data;
});

export const updateCategoryThunk = createAsyncThunk<
  Category,
  {id: string; updates: UpdateCategory},
  {rejectValue: string}
>('categories/updateCategory', async ({id, updates}, {rejectWithValue}) => {
  const {data, error} = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return rejectWithValue(error.message);
  }
  return data;
});

export const deleteCategoryThunk = createAsyncThunk<
  string, // returning the ID of the deleted category
  string, // accepting category ID
  {rejectValue: string}
>('categories/deleteCategory', async (categoryId, {rejectWithValue}) => {
  const {error} = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);

  if (error) {
    return rejectWithValue(error.message);
  }
  return categoryId;
});
