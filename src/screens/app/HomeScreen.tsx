/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {fetchAllCategoriesThunk} from '../../features/categories/categoriesThunk';
import {fetchAllAccountsThunk} from '../../features/accounts/accountsThunk';
import {
  addExpenseThunk,
  fetchAllExpensesThunk,
} from '../../features/expenses/expensesThunk';
import GroupedExpensesList from '../../components/GroupedExpensesList';

const HomeScreen = () => {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const {categories, categoriesLoading, categoriesError} = useAppSelector(
    state => state.categories,
  );
  const {accounts, accountsLoading, accountsError} = useAppSelector(
    state => state.accounts,
  );
  const {expenses, expenseLoading, expenseError} = useAppSelector(
    state => state.expenses,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [amount, setAmount] = useState('0');
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [description, setDescription] = useState('');
  // const [newCategory, setNewCategory] = useState('');

  const handleAddExpense = () => {
    if (!selectedAccount && !selectedCategory) {
      console.log(selectedAccount, selectedCategory, 'not selected');
      return;
    }

    dispatch(
      addExpenseThunk({
        amount: amount,
        user_id: user?.id!,
        account_id: selectedAccount!,
        category_id: selectedCategory!,
        description: description,
      }),
    ).finally(() => {
      setAmount('0');
      setDescription('');
    });
  };

  useEffect(() => {
    dispatch(fetchAllCategoriesThunk(user?.id!)).then(() => {
      setSelectedCategory(categories[0].id);
    });
    dispatch(fetchAllAccountsThunk(user?.id!)).then(() => {
      setSelectedAccount(accounts[0].id);
    });
    dispatch(fetchAllExpensesThunk(user?.id!));
  }, [dispatch, user]);

  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          gap: 16,
        }}>
        {categoriesLoading ? (
          <Text>Loading...</Text>
        ) : categoriesError ? (
          <Text>{categoriesError}</Text>
        ) : (
          <View style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={itemValue => setSelectedCategory(itemValue)}>
                {categories.map(category => (
                  <Picker.Item
                    key={category.id}
                    label={category.name ?? 'Unnamed'}
                    value={category.name}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}
        {accountsLoading ? (
          <Text>Loading...</Text>
        ) : accountsError ? (
          <Text>{accountsError}</Text>
        ) : (
          <View style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
            <Text style={styles.label}>Account</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedAccount}
                onValueChange={itemValue => setSelectedAccount(itemValue)}>
                {accounts.map(category => (
                  <Picker.Item
                    key={category.id}
                    label={category.name!}
                    value={category.name}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 16,
        }}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="numeric"
          style={styles.input}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 16,
        }}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          keyboardType="default"
          style={styles.input}
        />
      </View>
      <View>
        <TouchableOpacity
          style={[styles.button, expenseLoading && styles.disabledButton]}
          onPress={handleAddExpense}
          disabled={expenseLoading}>
          {expenseLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Expense</Text>
          )}
        </TouchableOpacity>
        {expenseError && <Text style={styles.errorText}>{expenseError}</Text>}
      </View>
      <GroupedExpensesList expenses={expenses} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  label: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
  radioButton: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ccc',
    marginTop: 8,
  },
  radioButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  radioText: {
    color: '#333',
  },
  radioTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 12,
  },
});
