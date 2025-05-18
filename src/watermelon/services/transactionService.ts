import {Q} from '@nozbe/watermelondb';
import {database} from '../database';
import Transaction from '../models/Transaction.model.';

export type WMNewTransactionInput = {
  hash: string;
  isSynced: boolean;
  bankName: string | null;
  type: 'CREDIT' | 'DEBIT' | null;
  amount: number | null;
  description: string | null;
  transactionTime: number;
  party: string | null;
  category_id: string | null;
  account_id: string | null;
};
export const mapTransactionsToWMInputs = (
  transactions: Transaction[],
): WMNewTransactionInput[] => {
  return transactions.map(t => ({
    hash: t.hash,
    isSynced: t.isSynced,
    bankName: t.bankName ?? null,
    type: t.type ?? null,
    amount: t.amount ?? null,
    description: t.description ?? null,
    transactionTime:
      typeof t.transactionTime === 'number'
        ? t.transactionTime
        : new Date(t.transactionTime).getTime(),
    party: t.party ?? null,
    category_id: t.categoryId ?? null,
    account_id: t.accountId ?? null,
  }));
};

export async function createWMTransactions(
  dataList: WMNewTransactionInput[],
): Promise<{
  created: WMNewTransactionInput[];
  error: Error | null;
}> {
  try {
    const collection = database.collections.get<Transaction>('transactions');

    const existingHashes = await collection
      .query(Q.where('hash', Q.oneOf(dataList.map(d => d.hash))))
      .fetch();

    const existingHashSet = new Set(existingHashes.map(t => t.hash));

    const newDataList = dataList.filter(d => !existingHashSet.has(d.hash));

    await database.write(async () => {
      for (const data of newDataList) {
        await collection.create(t => {
          t.hash = data.hash;
          t.isSynced = data.isSynced;
          t.bankName = data.bankName ?? '';
          t.type = data.type ?? 'DEBIT';
          t.amount = data.amount ?? 0;
          t.description = data.description ?? null;
          t.transactionTime = data.transactionTime;
          t.party = data.party ?? '';
        });
      }
    });

    return {
      created: newDataList,
      error: null,
    };
  } catch (error) {
    console.error('Failed to add transactions:', error);
    return {
      created: [],
      error: error as Error,
    };
  }
}

export async function createWMTransaction(
  data: WMNewTransactionInput,
): Promise<Transaction> {
  const existing = await database.collections
    .get('transactions')
    .query(Q.where('hash', data.hash))
    .fetch();

  if (existing.length === 0) {
    let transaction: Transaction;

    await database.write(async () => {
      const collection = database.collections.get<Transaction>('transactions');
      transaction = await collection.create(t => {
        t.hash = data.hash;
        t.isSynced = data.isSynced;
        t.bankName = data.bankName ?? '';
        t.type = data.type ?? 'DEBIT';
        t.amount = data.amount ?? 0;
        t.description = data.description ?? null;
        t.transactionTime = data.transactionTime;
        t.party = data.party ?? '';
      });
    });

    return transaction!;
  } else {
    console.log('Transaction Already Exists');
    throw new Error('Transaction Already Exists');
  }
}

export async function getTransactionsSinceEpoch(
  lastSyncEpoch: number,
): Promise<{
  data: WMNewTransactionInput[] | null;
  error: Error | null;
}> {
  try {
    const transactions = await database.collections
      .get<Transaction>('transactions')
      .query(Q.where('transaction_time', Q.gt(lastSyncEpoch)))
      .fetch();
    const listOfWMTransaction = mapTransactionsToWMInputs(transactions);
    return {data: listOfWMTransaction, error: null};
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return {data: null, error: error as Error};
  }
}
