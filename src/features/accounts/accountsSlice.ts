import {createSlice} from '@reduxjs/toolkit';
import {
  fetchAllAccountsThunk,
  updateAccountThunk,
  addAccountThunk,
  deleteAccountThunk,
} from './accountsThunk';
import {Database} from '../../../database.types';

type Account = Database['public']['Tables']['categories']['Row'];

interface AccountsState {
  accounts: Account[];
  accountsLoading: boolean;
  accountsError: string | null;
}

const initialState: AccountsState = {
  accounts: [],
  accountsLoading: false,
  accountsError: null,
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch
      .addCase(fetchAllAccountsThunk.pending, state => {
        state.accountsLoading = true;
        state.accountsError = null;
      })
      .addCase(fetchAllAccountsThunk.fulfilled, (state, action) => {
        state.accountsLoading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAllAccountsThunk.rejected, (state, action) => {
        state.accountsLoading = false;
        state.accountsError = action.payload ?? 'Failed to fetch accounts';
      })

      // Add
      .addCase(addAccountThunk.fulfilled, (state, action) => {
        const payload = {
          created_at: action.payload.created_at!,
          id: action.payload.id!,
          name: action.payload.name!,
          user_id: action.payload.user_id!,
          updated_at: action.payload.created_at!,
        };
        if (action.payload.created_at) {
          state.accounts.push(payload);
        }
      })
      .addCase(addAccountThunk.rejected, (state, action) => {
        state.accountsError = action.payload ?? 'Failed to add account';
      })

      // Delete
      .addCase(deleteAccountThunk.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter(c => c.id !== action.payload);
      })
      .addCase(deleteAccountThunk.rejected, (state, action) => {
        state.accountsError = action.payload ?? 'Failed to delete category';
      })

      // Update
      .addCase(updateAccountThunk.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          const payload = {
            created_at: action.payload.created_at!,
            id: action.payload.id!,
            name: action.payload.name!,
            user_id: action.payload.user_id!,
            updated_at: action.payload.created_at!,
          };
          state.accounts[index] = payload;
        }
      })
      .addCase(updateAccountThunk.rejected, (state, action) => {
        state.accountsError = action.payload ?? 'Failed to update account';
      });
  },
});

export default accountsSlice.reducer;
