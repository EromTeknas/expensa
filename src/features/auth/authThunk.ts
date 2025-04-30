import {createAsyncThunk} from '@reduxjs/toolkit';
import {signInWithGoogle} from '../../services/googleSignIn';
import {supabase} from '../../services/supbaseClient';

export const signInWithGoogleThunk = createAsyncThunk(
  'auth/signInWithGoogle',
  async () => {
    console.log('here');
    const user = await signInWithGoogle();
    return user;
  },
);

export const logoutThunk = createAsyncThunk(
  'auth/logoutUser',
  async (_, {rejectWithValue}) => {
    const {error} = await supabase.auth.signOut();
    if (error) {
      return rejectWithValue(error);
    }
    return;
  },
);
