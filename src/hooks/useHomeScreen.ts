import {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {
  fetchAllCategoriesThunk,
  fetchAllAccountsThunk,
  fetchAllExpensesThunk,
  addExpenseThunk,
} from '../features/home/homeThunk';

export const useHomeScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const {category, account, expense} = useAppSelector(state => state.home);

  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [amount, setAmount] = useState('0');
  const [description, setDescription] = useState('');

  // Fetch categories, accounts, and expenses
  useEffect(() => {
    if (!user?.id) {
      return;
    }
    dispatch(fetchAllCategoriesThunk(user.id));
    dispatch(fetchAllAccountsThunk(user.id));
    dispatch(fetchAllExpensesThunk(user.id));
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

  const handleAddExpense = () => {
    if (!selectedCategory || !selectedAccount || !user?.id) {
      return;
    }

    return dispatch(
      addExpenseThunk({
        amount: parseFloat(amount),
        user_id: user.id,
        category_id: selectedCategory,
        account_id: selectedAccount,
        description,
      }),
    ).finally(() => {
      setAmount('0');
      setDescription('');
    });
  };

  return {
    category,
    account,
    expense,
    selectedCategory,
    setSelectedCategory,
    selectedAccount,
    setSelectedAccount,
    amount,
    setAmount,
    description,
    setDescription,
    handleAddExpense,
  };
};
