import React, {useMemo} from 'react';
import {View, Text, SectionList, StyleSheet} from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {EnrichedTransaction} from '../models/transactions';
import TransactionCard from './TransactionCard';
import COLORS from '../constants/colors';
import {FONTFAMILIES} from '../constants/fonts';

dayjs.extend(relativeTime);

interface TransactionListProps {
  transactions: EnrichedTransaction[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

const groupTransactionsByDate = (transactions: EnrichedTransaction[]) => {
  const grouped = transactions.reduce((groups, transaction) => {
    const date = dayjs(transaction.transaction_time)
      .startOf('day')
      .toISOString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, EnrichedTransaction[]>);

  // Sort dates (most recent first) and transactions within each group
  return Object.keys(grouped)
    .sort((a, b) => dayjs(b).diff(dayjs(a))) // Sort dates
    .map(date => ({
      title: date,
      data: grouped[date].sort((a, b) =>
        dayjs(b.transaction_time).diff(dayjs(a.transaction_time)),
      ), // Sort transactions within each date
    }));
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
  // Group transactions into sections by date
  const sections = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions],
  );

  // Render the section header (date label)
  const renderSectionHeader = ({
    section: {title},
  }: {
    section: {title: string};
  }) => (
    <View style={styles.stickyHeader}>
      <Text style={styles.dateText}>{getDateLabel(title)}</Text>
    </View>
  );

  // Render individual transaction items
  const renderItem = ({item}: {item: EnrichedTransaction}) => (
    <TransactionCard
      transaction={item}
      onEdit={onEdit}
      onDelete={onDelete}
      onSelect={onSelect}
    />
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item.id.toString() + index}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled
      renderSectionFooter={() => <View style={styles.sectionSeparator} />}
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
  sectionSeparator: {
    height: 16,
  },
  itemSeparator: {
    height: 8,
  },
});

export default TransactionList;
