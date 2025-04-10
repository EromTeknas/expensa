import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../../app/store';
import {signInWithGoogleThunk} from './authThunk';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const signIn = () => {
    dispatch(signInWithGoogleThunk());
  };

  return {user, loading, error, signIn};
};
