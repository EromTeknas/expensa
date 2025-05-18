import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../app/hooks';

export const useSyncTransactionsScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const {
    isSyncing,
    hasNewTransactions,
    lastSyncTransactionDate,
    syncTransactions,
    syncTransactionsButtonState,
  } = useAppSelector(state => state.syncTransactions);

  useEffect(() => {});

  return {
    isSyncing,
    hasNewTransactions,
    lastSyncTransactionDate,
    syncTransactions,
    syncTransactionsButtonState,
  };
};
