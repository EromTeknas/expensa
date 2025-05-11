import {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {
  fetchAllCategoriesThunk,
  fetchAllAccountsThunk,
  fetchAllTransactionsThunk,
  addTransactionThunk,
  fetchTransactionSumsThunk,
} from '../features/home/homeThunk';
import {TRANSACTION_TYPE, TransactionType} from '../models/transactions';
import dayjs from 'dayjs';
import showToast from '../utils/toast';
import {logoutThunk} from '../features/auth/authThunk';
import {getCurrentDateInUTCDate} from '../utils/dateTimeUtilities';
import {
  getCachedTransactionSums,
  getLastFetchDate,
  saveLastFetchDate,
  saveTransactionSums,
  updateTransactionSums,
} from '../utils/localStorageUtilities';

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
  const [transactionTime, setTransactionTime] = useState<Date>(
    getCurrentDateInUTCDate(),
  );
  const [sums, setSums] = useState({
    weeklySum: meta.weeklySum,
    monthlySum: meta.monthlySum,
  });

  const todaysDate = dayjs().format('YYYY-MM-DD');

  // Fetch transaction sums (optimized)
  const fetchSums = async () => {
    try {
      const lastFetchDate = await getLastFetchDate();
      const today = dayjs().format('YYYY-MM-DD');

      if (lastFetchDate === today) {
        // Fetch from local storage
        const cachedSums = await getCachedTransactionSums();
        setSums(cachedSums);
      } else if (user?.id) {
        // Fetch from the database
        const result = await dispatch(
          fetchTransactionSumsThunk(user.id),
        ).unwrap();
        setSums(result);

        // Save to local storage
        await saveTransactionSums(result);
        await saveLastFetchDate(today);
      }
    } catch (error) {
      console.error('Error fetching transaction sums:', error);
    }
  };
  // Fetch categories, accounts, and transactions
  useEffect(() => {
    if (!user?.id) {
      dispatch(logoutThunk());
    }
    fetchSums();
    dispatch(fetchTransactionSumsThunk(user?.id!));
    dispatch(fetchAllCategoriesThunk(user?.id!));
    dispatch(fetchAllAccountsThunk(user?.id!));
    dispatch(
      fetchAllTransactionsThunk({
        userId: user?.id!,
        date: todaysDate,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    console.log('Transaction Time ', transactionTime.toISOString());
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
            transaction_time: transactionTime.toISOString(),
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
      // Inside handleAddTransaction after adding the transaction successfully
      await updateTransactionSums(transactionAmount, transactionType, sums);
      // Re-fetch sums after a successful transaction
      await fetchSums();
    } catch (error) {
      showToast({
        message: 'Failed to add transaction',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreditTransaction = () =>
    handleAddTransaction(TRANSACTION_TYPE.CREDIT, setCreditLoading);

  const handleDebitTransaction = () =>
    handleAddTransaction(TRANSACTION_TYPE.DEBIT, setDebitLoading);

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
    transactionTime,
    setTransactionTime,
    sums,
  };
};
