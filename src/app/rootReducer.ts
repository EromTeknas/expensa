import {combineReducers} from 'redux';
import authReducer from '../features/auth/authSlice';
import homeReducer from '../features/home/homeSlice';
import syncTransactionsReducer from '../features/syncTransactions/syncTransactionsSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  home: homeReducer,
  syncTransactions: syncTransactionsReducer,
});

export default rootReducer;
