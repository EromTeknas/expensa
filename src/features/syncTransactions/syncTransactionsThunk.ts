import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  createWMTransactions,
  WMNewTransactionInput,
} from '../../watermelon/services/transactionService';
import {
  addMultipleTransactions,
  checkIfHashesExist,
  EnrichedTransaction,
  fetchEnrichedTransactionsByIds,
  mapWMTransactionsToNewTransactions,
} from 'src/models/transactions';

export const addSyncTransactionsThunk = createAsyncThunk<
  {
    transactionsCreated: WMNewTransactionInput[];
    transactionsSkipped: WMNewTransactionInput[];
  },
  WMNewTransactionInput[],
  {rejectValue: string}
>(
  'syncTransactions/addSyncTransactionsSinceEpoch',
  async (syncTransactionsToCreate, {rejectWithValue}) => {
    const {created, skipped, error} = await createWMTransactions(
      syncTransactionsToCreate,
    );

    if (error) {
      return rejectWithValue(error.message);
    } else {
      return {
        transactionsCreated: created ?? [],
        transactionsSkipped: skipped ?? [],
      };
    }
  },
);

// export const fetchAllSyncTransactionsSinceLastSyncDateThunk = createAsyncThunk<
//   WMNewTransactionInput[],
//   number,
//   {rejectValue: string}
// >(
//   'syncTransactions/fetchAllSyncTransactionsSinceLastSyncDate',
//   async (lastSyncTransactionDate, {rejectWithValue}) => {
//     const {data: transactions, error} = await getTransactionsSinceEpoch(
//       lastSyncTransactionDate,
//     );

//     if (error) {
//       console.error('Error while fetching SyncTransactions', error);
//       return rejectWithValue(error.message);
//     } else {
//       //   console.log('Fetched transactions:', transactions);
//       return transactions ?? [];
//     }
//   },
// );

export const syncTransactionsToSupabaseThunk = createAsyncThunk<
  {
    addedTransactions: EnrichedTransaction[];
    skippedTransactions: WMNewTransactionInput[];
  },
  {
    userId: string;
    transactionsToSync: WMNewTransactionInput[];
  },
  {rejectValue: string}
>(
  'syncTransactions/syncTransactionsToSupabase',
  async ({userId, transactionsToSync}, {rejectWithValue}) => {
    const listOfHashes: string[] = transactionsToSync.map(t => t.hash);

    const {existingHashes, error: hashesError} = await checkIfHashesExist(
      listOfHashes,
    );

    if (hashesError) {
      return rejectWithValue(hashesError);
    }
    // ✅ Create the list of TransactionToSync (i.e., new transactions)
    const transactionsToAdd = transactionsToSync.filter(
      t => !existingHashes.includes(t.hash),
    );

    // ✅ Create the list of TransactionNotToSync (i.e., already exist / skipped)
    const skippedTransactions = transactionsToSync.filter(t =>
      existingHashes.includes(t.hash),
    );
    const newTransactions = mapWMTransactionsToNewTransactions(
      transactionsToAdd,
      userId,
    );
    const {data: addedTransactions, error: addError} =
      await addMultipleTransactions(newTransactions);

    if (addError) {
      return rejectWithValue(addError.message);
    }

    const listOfTransactionsIds: string[] = addedTransactions.map(t => t.id!);

    const {data: fetchedTransactions, error: fetchError} =
      await fetchEnrichedTransactionsByIds(listOfTransactionsIds);

    if (fetchError) {
      return rejectWithValue(fetchError.message);
    }

    return {
      addedTransactions: fetchedTransactions,
      skippedTransactions: skippedTransactions,
    };
  },
);
