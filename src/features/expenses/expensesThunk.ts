import {createAsyncThunk} from '@reduxjs/toolkit';
import {supabase} from '../../services/supbaseClient';

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (
    data: {
      amount: string;
      category: string;
      account: string;
      user_id: string;
    },
    thunkAPI,
  ) => {
    const {data: inserted, error} = await supabase
      .from('expenses')
      .insert([data])
      .select()
      .single();

    if (error) return thunkAPI.rejectWithValue(error.message);
    return inserted;
  },
);
