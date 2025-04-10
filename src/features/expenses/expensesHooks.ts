import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../../app/store';

export const useExpenses = () =>
  useSelector((state: RootState) => state.expenses);
export const useAppDispatch = () => useDispatch<AppDispatch>();
