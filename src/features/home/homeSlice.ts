import {createSlice} from '@reduxjs/toolkit';
import {
  addTransactionThunk,
  fetchAllAccountsThunk,
  fetchAllCategoriesThunk,
  fetchAllTransactionsThunk,
  fetchTransactionSumsThunk,
} from './homeThunk';
import {Category} from '../../models/categories';
import {Account} from '../../models/accounts';
import {EnrichedTransaction} from '../../models/transactions';

type homeScreenState = {
  category: {
    categories: Category[];
    categoriesLoading: boolean;
    categoriesError: string;
  };
  account: {
    accounts: Account[];
    accountsLoading: boolean;
    accountsError: string;
  };
  transaction: {
    transactions: EnrichedTransaction[];
    transactionsLoading: boolean;
    transactionsError: string;
  };
  meta: {
    weeklySum: number;
    monthlySum: number;
    metaLoading: boolean;
  };
};

const initialHomeScreenState: homeScreenState = {
  category: {
    categories: [],
    categoriesLoading: false,
    categoriesError: '',
  },
  account: {
    accounts: [],
    accountsLoading: false,
    accountsError: '',
  },
  transaction: {
    transactions: [],
    transactionsLoading: false,
    transactionsError: '',
  },
  meta: {
    weeklySum: 0,
    monthlySum: 0,
    metaLoading: false,
  },
};

const homeSlice = createSlice({
  name: 'home',
  initialState: initialHomeScreenState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Categories Thunk
      .addCase(fetchAllCategoriesThunk.pending, state => {
        state.category.categoriesLoading = true;
      })
      .addCase(fetchAllCategoriesThunk.fulfilled, (state, action) => {
        state.category.categories = action.payload;
        state.category.categoriesLoading = false;
      })
      .addCase(fetchAllCategoriesThunk.rejected, (state, action) => {
        state.category.categoriesLoading = false;
        state.category.categoriesError =
          action.error.message ?? 'Failed to fetch categories';
      })

      // Accounts Thunk
      .addCase(fetchAllAccountsThunk.pending, state => {
        state.account.accountsLoading = true;
      })
      .addCase(fetchAllAccountsThunk.fulfilled, (state, action) => {
        state.account.accounts = action.payload;
        state.account.accountsLoading = false;
      })
      .addCase(fetchAllAccountsThunk.rejected, (state, action) => {
        state.account.accountsLoading = false;
        state.account.accountsError =
          action.error.message ?? 'Failed to fetch accounts';
      })

      // Transactions Thunk
      .addCase(fetchAllTransactionsThunk.pending, state => {
        state.transaction.transactionsLoading = true;
      })
      .addCase(fetchAllTransactionsThunk.fulfilled, (state, action) => {
        state.transaction.transactions = action.payload;
        state.transaction.transactionsLoading = false;
      })
      .addCase(fetchAllTransactionsThunk.rejected, (state, action) => {
        state.transaction.transactionsLoading = false;
        state.transaction.transactionsError =
          action.error.message ?? 'Failed to fetch transactions';
      })

      // Add Transaction Thunk
      .addCase(addTransactionThunk.pending, state => {
        state.transaction.transactionsLoading = true;
      })
      .addCase(addTransactionThunk.fulfilled, (state, action) => {
        state.transaction.transactions = action.payload;
        state.transaction.transactionsLoading = false;
      })
      .addCase(addTransactionThunk.rejected, (state, action) => {
        state.transaction.transactionsLoading = false;
        state.transaction.transactionsError =
          action.error.message ?? 'Failed to add transaction';
      })
      .addCase(fetchTransactionSumsThunk.pending, state => {
        state.meta.metaLoading = true;
      })
      .addCase(fetchTransactionSumsThunk.fulfilled, (state, action) => {
        state.meta.weeklySum = action.payload.weeklySum;
        state.meta.monthlySum = action.payload.monthlySum;
        state.meta.metaLoading = false;
      })
      .addCase(fetchTransactionSumsThunk.rejected, (state, action) => {
        state.meta.metaLoading = false;
        state.transaction.transactionsError =
          action.payload ?? 'Failed to fetch transaction sums';
      });
  },
});

export default homeSlice.reducer;
