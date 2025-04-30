import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import GroupedExpensesList from '../../components/GroupedExpensesList';
import {useHomeScreen} from '../../hooks/useHomeScreen';
import Textfield, {TEXTFIELD_SIZE} from '../../components/common/Textfield';
import COLORS from '../../constants/colors';

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <View style={styles.row}>
            {category.categoriesLoading ? (
              <Text>Loading...</Text>
            ) : category.categoriesError ? (
              <Text>{category.categoriesError}</Text>
            ) : (
              <View style={styles.column}>
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
              <View style={styles.column}>
                <Text style={styles.label}>Account</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    style={styles.picker}
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <Textfield
            value={amount}
            size={TEXTFIELD_SIZE.MEDIUM}
            placeholder={'Enter Amount'}
            label={'Amount'}
            prefixIcon={'invert-mode-outline'}
            onChangeText={amt => setAmount(amt)}
            keyboardType={'number-pad'}
          />
          <Textfield
            value={description}
            size={TEXTFIELD_SIZE.SMALL}
            placeholder={'Enter Description'}
            label={'Description'}
            prefixIcon={'invert-mode-outline'}
            onChangeText={des => setDescription(des)}
            multiline={true}
            numberOfLines={5}
          />
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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: COLORS.backgroundColor,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    gap: 16,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  label: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 4,
    height: 36, // reduce overall height
    justifyContent: 'center',
  },
  picker: {
    fontSize: 10, // smaller text
  },
  inputGroup: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
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
