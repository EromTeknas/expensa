import {useState, useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {
  fetchAllCategoriesThunk,
  fetchAllAccountsThunk,
  fetchAllTransactionsThunk,
  addTransactionThunk,
  fetchTransactionSumsThunk,
  deleteTransactionThunk,
} from '../features/home/homeThunk';
import {
  EnrichedTransaction,
  TRANSACTION_TYPE,
  TransactionType,
} from '../models/transactions';
import dayjs from 'dayjs';
import showToast from '../utils/toast';
import {logoutThunk} from '../features/auth/authThunk';
import Toast from 'react-native-toast-message';

export const useHomeScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const {category, account, transaction, meta} = useAppSelector(
    state => state.home,
  );

  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [creditLoading, setCreditLoading] = useState<boolean>(false);
  const [debitLoading, setDebitLoading] = useState<boolean>(false);

  const [transactions, setTransactions] = useState<EnrichedTransaction[]>(
    transaction.transactions,
  );

  const softDeletedTransactionRef = useRef<number | null>(null);

  const todaysDate = dayjs().format('YYYY-MM-DD');
  const datePickerRef = useRef<{getSelectedDate: () => Date}>(null);
  const getSelectedDate = () => {
    const date = datePickerRef.current?.getSelectedDate();
    console.log('Selected Date for Submission:', date);
    return date;
  };
  // Fetch categories, accounts, and transactions
  useEffect(() => {
    if (!user?.id) {
      dispatch(logoutThunk());
    }
    dispatch(fetchTransactionSumsThunk(user?.id!));
    dispatch(fetchAllCategoriesThunk(user?.id!));
    dispatch(fetchAllAccountsThunk(user?.id!));
    dispatch(
      fetchAllTransactionsThunk({
        userId: user?.id!,
        date: todaysDate,
      }),
    );
  }, [dispatch, user, todaysDate]);

  // Auto select first category
  useEffect(() => {
    if (category.categories.length > 0) {
      setSelectedCategory(category.categories[0].id);
    }
  }, [category.categories]);

  // Auto select first account
  useEffect(() => {
    if (account.accounts.length > 0) {
      setSelectedAccount(account.accounts[0].id);
    }
  }, [account.accounts]);

  useEffect(() => {
    setTransactions(transaction.transactions);
  }, [transaction.transactions]);
  const handleAddTransaction = async (
    transactionType: TransactionType,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    // If User Id is not found. Logout.
    if (!user?.id) {
      dispatch(logoutThunk());
      return;
    }

    if (!selectedCategory || !selectedAccount || !user?.id) {
      return;
    }

    const transactionAmount = parseFloat(amount);

    // Validate that the amount is not null, 0, or negative
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      showToast({
        message: 'Please enter a valid amount',
        type: 'error',
      });
      return;
    }

    // Start loading
    setLoading(true);

    try {
      await dispatch(
        addTransactionThunk({
          newTransaction: {
            amount: transactionAmount,
            user_id: user.id,
            category_id: selectedCategory,
            account_id: selectedAccount,
            description,
            type: transactionType,
            transaction_time: getSelectedDate()?.toISOString(),
          },
          fetchOptions: {
            date: todaysDate,
          },
        }),
      ).unwrap();

      showToast({
        message: 'Transaction added successfully',
        type: 'success',
      });

      setAmount('');
      setDescription('');
    } catch (error) {
      showToast({
        message: 'Failed to add transaction',
        type: 'error',
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreditTransaction = () =>
    handleAddTransaction(TRANSACTION_TYPE.CREDIT, setCreditLoading);

  const handleDebitTransaction = () =>
    handleAddTransaction(TRANSACTION_TYPE.DEBIT, setDebitLoading);

  const handleDeleteTransaction = async (transactionId: number) => {
    let deletedTransactionIndex = transactions.findIndex(
      (tr, _) => tr.id === transactionId,
    );

    let deletedTransaction = transactions[deletedTransactionIndex];

    // Remove from the list immediately
    softDeletedTransactionRef.current = transactionId;

    setTransactions(prev => prev.filter(t => t.id !== transactionId));

    // Show undo toast
    showToast({
      message: 'Transaction deleted',
      type: 'info',
      trailingButton: {
        label: 'Undo',
        onPress: () => {
          console.log('undo');
          undoDelete(deletedTransaction, deletedTransactionIndex);
        },
      },
      afterToastCallback: async () => {
        // Check if the transaction was restored
        if (softDeletedTransactionRef.current === transactionId) {
          try {
            await dispatch(deleteTransactionThunk(deletedTransaction.id));
          } catch (error) {
            showToast({message: 'Failed to delete transaction', type: 'error'});
            // Restore on failure
            setTransactions(prev => {
              const updatedTransactions = [...prev];
              updatedTransactions.splice(
                deletedTransactionIndex,
                0,
                deletedTransaction,
              );
              return updatedTransactions;
            });
          }
        }
      },
    });
  };
  const undoDelete = (tr: EnrichedTransaction, trIndex: number) => {
    setTransactions(prev => {
      const updatedTransactions = [...prev];
      updatedTransactions.splice(trIndex, 0, tr);
      return updatedTransactions;
    });
    softDeletedTransactionRef.current = null;
    Toast.hide();
  };

  return {
    category,
    account,
    transaction,
    selectedCategory,
    setSelectedCategory,
    selectedAccount,
    setSelectedAccount,
    amount,
    setAmount,
    description,
    setDescription,
    handleCreditTransaction,
    handleDebitTransaction,
    creditLoading,
    debitLoading,
    meta,
    handleDeleteTransaction,
    transactions,
    datePickerRef,
  };
};
