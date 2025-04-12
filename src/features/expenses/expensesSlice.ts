import {createSlice} from '@reduxjs/toolkit';
import {Database} from '../../../database.types';
import {addExpenseThunk, fetchAllExpensesThunk} from './expensesThunk';

type Expense = Database['public']['Tables']['expenses']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Account = Database['public']['Tables']['categories']['Row'];
type EnrichedExpense = Omit<Expense, 'account_id' | 'category_id'> & {
  account: Account;
  category: Category;
};
interface ExpensesState {
  expenses: EnrichedExpense[];
  expenseLoading: boolean;
  expenseError: string;
}

const initialState: ExpensesState = {
  expenses: [],
  expenseLoading: false,
  expenseError: '',
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllExpensesThunk.pending, state => {
        state.expenseLoading = true;
      })
      .addCase(fetchAllExpensesThunk.fulfilled, (state, action) => {
        state.expenseLoading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchAllExpensesThunk.rejected, (state, action) => {
        state.expenseLoading = false;
        state.expenseError = action.error.message!;
      })
      .addCase(addExpenseThunk.pending, state => {
        state.expenseLoading = true;
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
        state.expenseLoading = false;

        state.expenses.push(expense);
      })
      .addCase(addExpenseThunk.rejected, (state, action) => {
        state.expenseLoading = false;
        state.expenseError = action.error.message!;
      });
  },
});

export default expensesSlice.reducer;
