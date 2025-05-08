import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import TransactionCard from './TransactionCard';
import {EnrichedTransaction} from '../models/transactions';

type GroupedExpenses = {
  title: string;
  total: number;
  data: EnrichedTransaction[];
};

type Props = {
  transactions: EnrichedTransaction[];
};

const GroupedTransactionsList = ({transactions}: Props) => {
  // Group expenses by date and calculate total per date
  const grouped = transactions.reduce<Record<string, GroupedExpenses>>(
    (acc, transaction) => {
      const date = new Date(transaction.created_at).toDateString();
      if (!acc[date]) {
        acc[date] = {title: date, total: 0, data: []};
      }
      acc[date].data.push(transaction);
      acc[date].total += transaction.amount;
      return acc;
    },
    {},
  );

  const groupedArray = Object.values(grouped)
    .map(group => ({
      ...group,
      data: group.data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    }))
    .sort((a, b) => new Date(b.title).getTime() - new Date(a.title).getTime());
  return (
    // <View style={styles.container}>
    <FlatList
      bounces={true}
      data={groupedArray}
      keyExtractor={(item: GroupedExpenses) => item.title}
      renderItem={({item}) => (
        <View>
          <View style={styles.dateRow}>
            <Text style={styles.dateSeparator}>{item.title}</Text>
            <Text style={styles.dateTotal}>₹{item.total.toFixed(2)}</Text>
          </View>
          {item.data.map(expense => (
            <TransactionCard
              transaction={expense}
              onDelete={id => console.log('onDelete')}
              onEdit={id => console.log('onEdit')}
              onSelect={id => console.log('onSelect')}
            />
          ))}
        </View>
      )}
      contentContainerStyle={styles.content}
    />
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
  },
  content: {
    paddingBottom: 20,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateSeparator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default GroupedTransactionsList;
