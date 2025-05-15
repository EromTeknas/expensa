import {createAsyncThunk} from '@reduxjs/toolkit';
import {signInWithGoogle} from '../../services/googleSignIn';
import {supabase} from '../../services/supbaseClient';

export const signInWithGoogleThunk = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, {rejectWithValue}) => {
    try {
      const user = await signInWithGoogle();

      if (!user) {
        return rejectWithValue('Google sign-in failed or was cancelled.');
      }

      return user;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      return rejectWithValue(error.message || 'An unexpected error occurred.');
    }
  },
);

export const logoutThunk = createAsyncThunk(
  'auth/logoutUser',
  async (_, {rejectWithValue}) => {
    try {
      const {error} = await supabase.auth.signOut();

      if (error) {
        console.error('Logout Error:', error.message);
        return rejectWithValue(error.message);
      }

      return;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An unexpected error occurred during logout.');
    }
  },
);
