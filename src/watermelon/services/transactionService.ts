import {Q} from '@nozbe/watermelondb';
import {database} from '../database';
import Transaction from '../models/Transaction.model.';

export type WMNewTransactionInput = {
  id?: string; // optional custom id
  hash: string;
  isSynced: boolean;
  bankName: string | null;
  type: 'CREDIT' | 'DEBIT' | null;
  amount: number | null;
  description: string | null;
  transactionTime: number;
  party: string | null;
};

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
        if (data.id) {
          t._raw.id = ; // optional custom id
        }
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
