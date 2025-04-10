import { createSlice } from '@reduxjs/toolkit';
import { signInWithGoogleThunk } from './authThunk';

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithGoogleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signInWithGoogleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Sign-in failed';
      });
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;
