import {createAsyncThunk} from '@reduxjs/toolkit';
import {signInWithGoogle} from '../../services/googleSignIn';

export const signInWithGoogleThunk = createAsyncThunk(
  'auth/signInWithGoogle',
  async () => {
    const user = await signInWithGoogle();
    return user;
  },
);
