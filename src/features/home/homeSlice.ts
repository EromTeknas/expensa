import {createSlice} from '@reduxjs/toolkit';
import {Database} from '../../../database.types';
import {
  addExpenseThunk,
  fetchAllAccountsThunk,
  fetchAllCategoriesThunk,
  fetchAllExpensesThunk,
} from './homeThunk';
type Category = Database['public']['Tables']['categories']['Row'];
type Account = Database['public']['Tables']['categories']['Row'];
type Expense = Database['public']['Tables']['expenses']['Row'];
type EnrichedExpense = Omit<Expense, 'account_id' | 'category_id'> & {
  account: Account;
  category: Category;
};
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
  expense: {
    expenses: EnrichedExpense[];
    expensesLoading: boolean;
    expensessError: string;
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
  expense: {
    expenses: [],
    expensesLoading: false,
    expensessError: '',
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
        state.category.categoriesError = action.error.name!;
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
        state.account.accountsError = action.error.name!;
      })
      // Expenses Thunk
      .addCase(fetchAllExpensesThunk.pending, state => {
        state.expense.expensesLoading = true;
      })
      .addCase(fetchAllExpensesThunk.fulfilled, (state, action) => {
        state.expense.expenses = action.payload;
        state.expense.expensesLoading = false;
      })
      .addCase(fetchAllExpensesThunk.rejected, (state, action) => {
        state.expense.expensesLoading = false;
        state.expense.expensessError = action.error.name!;
      })
      // Add Expense
      .addCase(addExpenseThunk.pending, state => {
        state.expense.expensesLoading = true;
      })
      .addCase(addExpenseThunk.fulfilled, (state, action) => {
        const expense = {
          created_at: action.payload.created_at!,
          id: action.payload.id!,
          amount: action.payload.amount!,
          user_id: action.payload.user_id!,
          category: action.payload.category!,
          account: action.payload.account!,
          updated_at: action.payload.created_at!,
          description: action.payload.description!,
        };
        state.expense.expensesLoading = false;

        state.expense.expenses.push(expense);
      })
      .addCase(addExpenseThunk.rejected, (state, action) => {
        state.expense.expensesLoading = false;
        state.expense.expensessError = action.error.message!;
      });
  },
});

export default homeSlice;
