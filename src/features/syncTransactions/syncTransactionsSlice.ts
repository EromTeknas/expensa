import {createSlice} from '@reduxjs/toolkit';
import {WMNewTransactionInput} from 'src/watermelon/services/transactionService';
import {
  addSyncTransactionsThunk,
  syncTransactionsToSupabaseThunk,
} from './syncTransactionsThunk';
import {EnrichedTransaction} from 'src/models/transactions';

type SyncTransactionsScreenState = {
  isSyncing: boolean;
  hasNewTransactions: boolean;
  lastSyncTransactionDate: Date | null;
  syncTransactions: {
    loading: boolean;
    error: string;
    selectedTransactionsHashes: string[];
    unsyncedTransactions: WMNewTransactionInput[];
    syncedTransactions: EnrichedTransaction[];
    skippedTransactions: WMNewTransactionInput[];
  };
  syncTransactionsButtonState: {
    loading: boolean;
  };
};

const initialSyncTransactionsScreenState: SyncTransactionsScreenState = {
  isSyncing: false,
  hasNewTransactions: false,
  lastSyncTransactionDate: null,
  syncTransactions: {
    loading: false,
    error: '',
    selectedTransactionsHashes: [],
    skippedTransactions: [],
    unsyncedTransactions: [],
    syncedTransactions: [],
  },
  syncTransactionsButtonState: {
    loading: false,
  },
};

const syncTransactionsSlice = createSlice({
  name: 'syncTransactions',
  initialState: initialSyncTransactionsScreenState,
  reducers: {
    selectTransaction: (state, action: {payload: string}) => {
      const hash = action.payload;
      if (!state.syncTransactions.selectedTransactionsHashes.includes(hash)) {
        state.syncTransactions.selectedTransactionsHashes.push(hash);
      }
    },

    deselectTransaction: (state, action: {payload: string}) => {
      const hash = action.payload;
      state.syncTransactions.selectedTransactionsHashes =
        state.syncTransactions.selectedTransactionsHashes.filter(
          h => h !== hash,
        );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addSyncTransactionsThunk.pending, state => {
        state.syncTransactions.loading = true;
      })
      .addCase(addSyncTransactionsThunk.fulfilled, (state, action) => {
        state.syncTransactions.unsyncedTransactions =
          action.payload.transactionsCreated;
        state.syncTransactions.skippedTransactions =
          action.payload.transactionsSkipped;
        state.syncTransactions.loading = false;
      })
      .addCase(addSyncTransactionsThunk.rejected, (state, action) => {
        state.syncTransactions.error =
          action.error.message ?? 'Failed to Sync Transactions';
        state.syncTransactions.loading = false;
      })
      .addCase(syncTransactionsToSupabaseThunk.pending, state => {
        state.syncTransactionsButtonState.loading = true;
      })
      .addCase(syncTransactionsToSupabaseThunk.fulfilled, (state, action) => {
        state.syncTransactions.syncedTransactions =
          action.payload.addedTransactions;
        state.syncTransactions.skippedTransactions =
          action.payload.skippedTransactions;
        state.syncTransactionsButtonState.loading = false;
      })
      .addCase(syncTransactionsToSupabaseThunk.rejected, (state, action) => {
        state.syncTransactions.error =
          action.error.message ?? 'Failed to Sync Transactions';
        state.syncTransactionsButtonState.loading = false;
      });
  },
});

export default syncTransactionsSlice.reducer;
