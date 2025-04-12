import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // You can use other icon sets
import {format} from 'date-fns';
import {Database} from '../../database.types';
export const categoryIconMap: {
  [key: string]: {iconName: string; color: string};
} = {
  food: {iconName: 'fast-food-outline', color: '#FFEBEE'},
  bills: {iconName: 'receipt-outline', color: '#E3F2FD'},
  travel: {iconName: 'airplane-outline', color: '#E8F5E9'},
  accessories: {iconName: 'watch-outline', color: '#F3E5F5'},
  health: {iconName: 'heart-outline', color: '#E1F5FE'},
  medicines: {iconName: 'medkit-outline', color: '#FFF3E0'},
  custom: {iconName: 'apps-outline', color: '#ECEFF1'}, // fallback
};

type Expense = Database['public']['Tables']['expenses']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Account = Database['public']['Tables']['categories']['Row'];
type EnrichedExpense = Omit<Expense, 'account_id' | 'category_id'> & {
  account: Account;
  category: Category;
};
type Props = {
  expense: EnrichedExpense;
  
};

const ExpenseCard: React.FC<Props> = ({expense}) => {
  const time = format(new Date(expense.created_at), 'hh:mm a');
  const matchedCategory =
    categoryIconMap[expense.category.name?.toLowerCase() || 'custom'] ||
    categoryIconMap.custom;

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View
        style={[styles.iconCircle, {backgroundColor: matchedCategory.color}]}>
        <Icon name={matchedCategory.iconName!} size={16} color="#007AFF" />
      </View>

      {/* Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.topRow}>
          <Text style={styles.description}>{expense.description}</Text>
          <Text style={styles.amount}>₹{expense.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.metaText}>{expense.account.name}</Text>
          <Text style={styles.metaText}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    marginVertical: 6,
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
});

export default ExpenseCard;
