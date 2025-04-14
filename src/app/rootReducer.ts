import {combineReducers} from 'redux';
import authReducer from '../features/auth/authSlice';
import homeReducer from '../features/home/homeSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  home: homeReducer,
});

export default rootReducer;
