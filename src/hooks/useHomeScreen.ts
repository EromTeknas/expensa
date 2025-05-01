import {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {
  fetchAllCategoriesThunk,
  fetchAllAccountsThunk,
  fetchAllTransactionsThunk,
  addTransactionThunk,
} from '../features/home/homeThunk';
import {TRANSACTION_TYPE} from '../models/transactions';

export const useHomeScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const {category, account, transaction} = useAppSelector(state => state.home);

  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [amount, setAmount] = useState('0');
  const [description, setDescription] = useState('');

  // Fetch categories, accounts, and transactions
  useEffect(() => {
    if (!user?.id) return;

    dispatch(fetchAllCategoriesThunk(user.id));
    dispatch(fetchAllAccountsThunk(user.id));
    dispatch(fetchAllTransactionsThunk(user.id));
  }, [dispatch, user]);

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

  const handleAddTransaction = () => {
    if (!selectedCategory || !selectedAccount || !user?.id) return;

    return dispatch(
      addTransactionThunk({
        amount: parseFloat(amount),
        user_id: user.id,
        category_id: selectedCategory,
        account_id: selectedAccount,
        description,
        type: TRANSACTION_TYPE.CREDIT, // CREDIT or DEBIT
      }),
    ).finally(() => {
      setAmount('0');
      setDescription('');
    });
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
    handleAddTransaction,
  };
};
