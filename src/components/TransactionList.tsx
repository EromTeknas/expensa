import React, {useMemo} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {EnrichedTransaction} from '../models/transactions';
import TransactionCard from './TransactionCard';
import COLORS from '../constants/colors';
import {FONTFAMILIES} from '../constants/fonts';

dayjs.extend(relativeTime);


// TODO
// Add gap between the transaction history of any 2 days
// Flat List is very glitchy. Find a alternative
interface TransactionListProps {
  transactions: EnrichedTransaction[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
}

const groupTransactionsByDate = (transactions: EnrichedTransaction[]) => {
  return transactions.reduce((groups, transaction) => {
    const date = dayjs(transaction.created_at).startOf('day').toISOString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, EnrichedTransaction[]>);
};

const getDateLabel = (date: string) => {
  const today = dayjs().startOf('day');
  const transactionDate = dayjs(date);

  if (transactionDate.isSame(today, 'day')) {
    return 'Today';
  }

  if (transactionDate.isSame(today.subtract(1, 'day'), 'day')) {
    return 'Yesterday';
  }

  return transactionDate.format('DD MMM, YYYY');
};

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  onSelect,
}) => {
  // Group and sort transactions by date
  const groupedTransactions = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions],
  );
  const sortedDates = useMemo(
    () =>
      Object.keys(groupedTransactions).sort((a, b) => dayjs(b).diff(dayjs(a))),
    [groupedTransactions],
  );

  // Flatten data for a single FlatList
  const flattenedData = useMemo(() => {
    const data: Array<{
      type: 'header' | 'item';
      value: string | EnrichedTransaction;
    }> = [];
    sortedDates.forEach(date => {
      data.push({type: 'header', value: date});
      groupedTransactions[date]
        .sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at)))
        .forEach(transaction => {
          data.push({type: 'item', value: transaction});
        });
    });
    return data;
  }, [sortedDates, groupedTransactions]);

  // Identify header indices for sticky headers
  const stickyHeaderIndices = flattenedData
    .map((item, index) => (item.type === 'header' ? index : null))
    .filter(index => index !== null) as number[];

  // Render a single item based on its type (header or transaction card)
  const renderItem = ({
    item,
  }: {
    item: {type: 'header' | 'item'; value: any};
  }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.stickyHeader}>
          <Text style={styles.dateText}>{getDateLabel(item.value)}</Text>
        </View>
      );
    }

    return (
      <TransactionCard
        transaction={item.value}
        onEdit={onEdit}
        onDelete={onDelete}
        onSelect={onSelect}
      />
    );
  };

  return (
    <FlatList
      data={flattenedData}
      // TODO
      // FIX THIS
      keyExtractor={(_, __) => `item-${Math.random()}`}
      //-----
      renderItem={renderItem}
      stickyHeaderIndices={stickyHeaderIndices}
      stickyHeaderHiddenOnScroll={false}
      // bounces={true}
    />
  );
};

const styles = StyleSheet.create({
  stickyHeader: {
    backgroundColor: COLORS.grey[800],
    paddingBottom: 8,
  },
  dateText: {
    fontFamily: FONTFAMILIES.LATO.bold,
    fontSize: 14,
    color: COLORS.grey[100],
  },
});

export default TransactionList;
