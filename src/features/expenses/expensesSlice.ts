import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  type: string; // e.g., "food", "shopping", etc.
  accountId: string;
}

interface ExpensesState {
  items: Expense[];
}

const initialState: ExpensesState = {
  items: [],
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.items.push(action.payload);
    },
    removeExpense: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(e => e.id !== action.payload);
    },
  },
});

export const {addExpense, removeExpense} = expensesSlice.actions;
export default expensesSlice.reducer;
