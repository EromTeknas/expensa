/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import GroupedExpensesList from '../../components/GroupedExpensesList';
import {useHomeScreen} from '../../hooks/useHomeScreen';

const HomeScreen = () => {
  const {
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
  } = useHomeScreen();

  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          gap: 16,
        }}>
        {category.categoriesLoading ? (
          <Text>Loading...</Text>
        ) : category.categoriesError ? (
          <Text>{category.categoriesError}</Text>
        ) : (
          <View style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={currentCategoryName =>
                  setSelectedCategory(
                    category.categories.find(
                      cat => cat.name === currentCategoryName,
                    )?.id,
                  )
                }>
                {category.categories.map(cat => (
                  <Picker.Item
                    key={cat.id}
                    label={cat.name ?? 'Unnamed'}
                    value={cat.name}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}
        {account.accountsLoading ? (
          <Text>Loading...</Text>
        ) : account.accountsError ? (
          <Text>{account.accountsError}</Text>
        ) : (
          <View style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
            <Text style={styles.label}>Account</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedAccount}
                onValueChange={currentAccountName =>
                  setSelectedAccount(
                    account.accounts.find(
                      acc => acc.name === currentAccountName,
                    )?.id,
                  )
                }>
                {account.accounts.map(acc => (
                  <Picker.Item
                    key={acc.id}
                    label={acc.name!}
                    value={acc.name}
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
          style={[
            styles.button,
            expense.expensesLoading && styles.disabledButton,
          ]}
          onPress={handleAddExpense}
          disabled={expense.expensesLoading}>
          {expense.expensesLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Expense</Text>
          )}
        </TouchableOpacity>
        {expense.expensessError && (
          <Text style={styles.errorText}>{expense.expensessError}</Text>
        )}
      </View>
      <GroupedExpensesList expenses={expense.expenses} />
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
