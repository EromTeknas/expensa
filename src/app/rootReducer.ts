import {combineReducers} from 'redux';
import authReducer from '../features/auth/authSlice';
import expensesReducer from '../features/expenses/expensesSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import accountsReducer from '../features/accounts/accountsSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  expenses: expensesReducer,
  categories: categoriesReducer,
  accounts: accountsReducer,
});

export default rootReducer;
