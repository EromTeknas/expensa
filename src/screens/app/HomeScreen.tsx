import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {fetchAllCategoriesThunk} from '../../features/categories/categoriesThunk';
import {fetchAllAccountsThunk} from '../../features/accounts/accountsThunk';

const HomeScreen = () => {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedAccount, setSelectedAccount] = useState();
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const {categories, categoriesLoading, categoriesError} = useAppSelector(
    state => state.categories,
  );
  const {accounts, accountsLoading, accountsError} = useAppSelector(
    state => state.accounts,
  );
  // const [newCategory, setNewCategory] = useState('');

  const handleAddExpense = () => {
    // Call your Redux/Supabase logic here
    console.log({amount, selectedCategory, selectedAccount});
  };

  useEffect(() => {
    console.log(user);
    dispatch(fetchAllCategoriesThunk(user?.id!));
    dispatch(fetchAllAccountsThunk(user?.id!));
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
      <Button title="Add Expense" onPress={handleAddExpense} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
});
