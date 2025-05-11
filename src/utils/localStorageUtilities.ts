import AsyncStorage from '@react-native-async-storage/async-storage';
import {TRANSACTION_TYPE, TransactionType} from '../models/transactions';

const TRANSACTION_SUMS_KEY = 'transactionSums';
const LAST_FETCH_DATE_KEY = 'lastSumFetchedDate';

export const saveTransactionSums = async (sums: {
  weeklySum: number;
  monthlySum: number;
}) => {
  try {
    await AsyncStorage.setItem(TRANSACTION_SUMS_KEY, JSON.stringify(sums));
  } catch (error) {
    console.error('Failed to save transaction sums:', error);
  }
};

export const getCachedTransactionSums = async (): Promise<{
  weeklySum: number;
  monthlySum: number;
}> => {
  try {
    const sums = await AsyncStorage.getItem(TRANSACTION_SUMS_KEY);
    return sums ? JSON.parse(sums) : {weeklySum: 0, monthlySum: 0};
  } catch (error) {
    console.error('Failed to get cached transaction sums:', error);
    return {weeklySum: 0, monthlySum: 0};
  }
};

export const saveLastFetchDate = async (date: string) => {
  try {
    await AsyncStorage.setItem(LAST_FETCH_DATE_KEY, date);
  } catch (error) {
    console.error('Failed to save last fetch date:', error);
  }
};

export const getLastFetchDate = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LAST_FETCH_DATE_KEY);
  } catch (error) {
    console.error('Failed to get last fetch date:', error);
    return null;
  }
};

export const updateTransactionSums = async (
  amount: number,
  type: TransactionType,
  currentSums: {weeklySum: number; monthlySum: number},
) => {
  try {
    const adjustment = type === TRANSACTION_TYPE.CREDIT ? amount : -amount;

    // Update sums
    const updatedSums = {
      weeklySum: currentSums.weeklySum + adjustment,
      monthlySum: currentSums.monthlySum + adjustment,
    };

    // Save updated sums to local storage
    await AsyncStorage.setItem('transactionSums', JSON.stringify(updatedSums));

    return updatedSums;
  } catch (error) {
    console.error('Error updating transaction sums:', error);
    return currentSums; // Return the existing sums if updating fails
  }
};
