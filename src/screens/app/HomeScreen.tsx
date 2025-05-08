import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import GroupedExpensesList from '../../components/GroupedTransactionsList';
import {useHomeScreen} from '../../hooks/useHomeScreen';
import Textfield, {TEXTFIELD_SIZE} from '../../components/common/Textfield';
import COLORS from '../../constants/colors';
import Dropdown, {DROPDOWN_SIZE} from '../../components/common/Dropdown';
import Button, {BUTTON_SIZE} from '../../components/common/Button';
import TotalTransactionsStatus from '../../components/TotalTransactionsStatus';
import {FONTFAMILIES} from '../../constants/fonts';
import {CurrencyRupeeIcon, CardTextIcon} from '../../components/common/Icons';

const HomeScreen = () => {
  const {
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
  } = useHomeScreen();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <TotalTransactionsStatus
            totalCreditAmount="10000"
            totalDebitAmount="21000"
          />
          <Text
            style={{
              fontFamily: FONTFAMILIES.LATO.bold,
              fontSize: 20,
              color: COLORS.grey[100],
            }}>
            Add Transaction
          </Text>
          <View style={styles.row}>
            {category.categoriesError ? (
              <Text>{category.categoriesError}</Text>
            ) : (
              <Dropdown
                items={category.categories}
                schema={{label: 'name', value: 'id'}}
                value={selectedCategory!}
                size={DROPDOWN_SIZE.SMALL}
                label={'Category'}
                onSelect={catId =>
                  setSelectedCategory(
                    category.categories.find(c => c.id === catId)?.id,
                  )
                }
              />
            )}
            {account.accountsError ? (
              <Text>{account.accountsError}</Text>
            ) : (
              <Dropdown
                items={account.accounts}
                schema={{label: 'name', value: 'id'}}
                value={selectedAccount!}
                size={DROPDOWN_SIZE.SMALL}
                label={'Account'}
                onSelect={accId =>
                  setSelectedAccount(
                    account.accounts.find(a => a.id === accId)?.id,
                  )
                }
              />
            )}
          </View>

          <Textfield
            value={amount}
            size={TEXTFIELD_SIZE.MEDIUM}
            placeholder={'Enter Amount'}
            label={'Amount'}
            prefixIcon={CurrencyRupeeIcon}
            onChangeText={amt => setAmount(amt)}
            keyboardType={'number-pad'}
          />
          <Textfield
            value={description}
            size={TEXTFIELD_SIZE.SMALL}
            placeholder={'Enter Description'}
            label={'Description'}
            prefixIcon={CardTextIcon}
            onChangeText={des => setDescription(des)}
            multiline={true}
            numberOfLines={5}
          />
          <View style={styles.buttonRow}>
            <Button
              label="Debit"
              onPress={handleDebitTransaction}
              size={BUTTON_SIZE.MEDIUM}
              prefixIcon={'arrow-down-left'}
              loading={transaction.transactionsLoading}
              style={{
                backgroundColor: COLORS.debitRed,
              }}
            />
            <Button
              label="Credit"
              onPress={handleCreditTransaction}
              size={BUTTON_SIZE.MEDIUM}
              prefixIcon={'arrow-down-left'}
              loading={transaction.transactionsLoading}
              style={{
                backgroundColor: COLORS.creditGreen,
              }}
            />
            {transaction.transactionsError && (
              <Text style={styles.errorText}>
                {transaction.transactionsError}
              </Text>
            )}
          </View>

          <GroupedExpensesList transactions={transaction.transactions} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
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

  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
});
