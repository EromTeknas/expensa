import {createSlice} from '@reduxjs/toolkit';
import {WMNewTransactionInput} from 'src/watermelon/services/transactionService';
import {
  addAndGetAllSyncTransactionsSinceLastSyncThunk,
  syncTransactionsToSupabaseThunk,
} from './syncTransactionsThunk';
import {EnrichedTransaction} from '../../models/transactions';
import {SyncStatusType} from '../../components/common/SyncTransactionButton';

// TODO
// Change Naming Convention for function and state
type SyncTransactionsScreenState = {
  isSyncing: boolean;
  hasNewTransactions: SyncStatusType;
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
  hasNewTransactions: SyncStatusType.SYNCING,
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

    hasNewTransactions: state => {
      if (state.isSyncing) {
        console.log('isSyncing');
        state.hasNewTransactions = SyncStatusType.SYNCING;
      }
      if (state.syncTransactions.unsyncedTransactions.length === 0) {
        console.log('Nothing to Syncr');
        state.hasNewTransactions = SyncStatusType.NOTHING_TO_SYNC;
      } else {
        console.log('Transactions Available');
        state.hasNewTransactions = SyncStatusType.TRANSACTIONS_AVAILABLE;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(
        addAndGetAllSyncTransactionsSinceLastSyncThunk.pending,
        state => {
          state.syncTransactions.loading = true;
          state.isSyncing = true;
          state.hasNewTransactions = SyncStatusType.SYNCING;
        },
      )
      .addCase(
        addAndGetAllSyncTransactionsSinceLastSyncThunk.fulfilled,
        (state, action) => {
          state.syncTransactions.unsyncedTransactions = action.payload;
          state.syncTransactions.loading = false;
          state.isSyncing = false;
          if (state.syncTransactions.unsyncedTransactions.length === 0) {
            console.log('Nothing to Syncr');
            state.hasNewTransactions = SyncStatusType.NOTHING_TO_SYNC;
          } else {
            console.log('Transactions Available');
            state.hasNewTransactions = SyncStatusType.TRANSACTIONS_AVAILABLE;
          }
        },
      )
      .addCase(
        addAndGetAllSyncTransactionsSinceLastSyncThunk.rejected,
        (state, action) => {
          state.syncTransactions.error =
            action.error.message ?? 'Failed to Sync Transactions';
          state.syncTransactions.loading = false;
          state.isSyncing = false;
          state.hasNewTransactions = SyncStatusType.SYNCING;
        },
      )
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
