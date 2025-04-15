import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import ExpenseCard from './ExpenseCard';
import { EnrichedExpense } from '../models/expenses';

type GroupedExpenses = {
  title: string;
  total: number;
  data: EnrichedExpense[];
};

type Props = {
  expenses: EnrichedExpense[];
};

const GroupedExpensesList: React.FC<Props> = ({expenses}) => {
  // Group expenses by date and calculate total per date
  const grouped = expenses.reduce<Record<string, GroupedExpenses>>(
    (acc, expense) => {
      const date = new Date(expense.created_at).toDateString();
      if (!acc[date]) {
        acc[date] = {title: date, total: 0, data: []};
      }
      acc[date].data.push(expense);
      acc[date].total += expense.amount;
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
    <View style={styles.container}>
      <FlatList
        data={groupedArray}
        keyExtractor={item => item.title}
        renderItem={({item}) => (
          <View>
            <View style={styles.dateRow}>
              <Text style={styles.dateSeparator}>{item.title}</Text>
              <Text style={styles.dateTotal}>₹{item.total.toFixed(2)}</Text>
            </View>
            {item.data.map(expense => (
              <ExpenseCard expense={expense} />
            ))}
          </View>
        )}
        contentContainerStyle={styles.content}
      />
    </View>
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
    marginTop: 20,
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

export default GroupedExpensesList;
