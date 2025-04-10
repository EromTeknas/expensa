// redux/slices/authSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '@supabase/supabase-js';
import {logoutThunk, signInWithGoogleThunk} from './authThunk';

interface AuthState {
  user: User | null;
  authLoading: boolean;
  authError: string;
}

const initialState: AuthState = {
  user: null,
  authLoading: false,
  authError: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signInWithGoogleThunk.pending, state => {
        state.authLoading = true;
      })
      .addCase(signInWithGoogleThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authLoading = false;
      })
      .addCase(signInWithGoogleThunk.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.error.message!;
      })
      .addCase(logoutThunk.pending, state => {
        state.authLoading = true;
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.user = null;
        state.authLoading = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.authError = action.error.message!;
        state.authLoading = false;
      });
  },
});
export const {setUser} = authSlice.actions;
export default authSlice.reducer;
