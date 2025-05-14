import {EnrichedTransaction} from '../../models/transactions';
import {database} from '../database';

export const saveTransactionWithHash = async (
  hash: string,
  transaction: EnrichedTransaction,
) => {
  try {
    await database.write(async () => {
      const newTransaction = await database.collections
        .get('transactions')
        .create((record: any) => {
          record.amount = transaction.amount;
          record.createdAt = transaction.created_at;
          record.description = transaction.description;
          record.transactionTime = transaction.transaction_time;
          record.type = transaction.type;
          record.updatedAt = transaction.updated_at;
          record.userId = transaction.user_id;
          record.account = JSON.stringify(transaction.account);
          record.category = JSON.stringify(transaction.category);
        });

      await database.collections.get('hashes').create((record: any) => {
        record.hash = hash;
        record.isSynced = false;
        record.transactionId = newTransaction.id;
        record.createdAt = new Date().toISOString();
      });
    });
    console.log('Transaction and hash saved successfully!');
  } catch (error) {
    console.error('Error saving transaction with hash:', error);
  }
};
// export const getUnsyncedTransactions = async (): Promise<
//   EnrichedTransaction[]
// > => {
//   try {
//     const hashes = await database.collections.get('hashes').query().fetch();
//     const unsynced = hashes.filter((hash: Hash) => !hash.isSynced);

//     const transactions = await Promise.all(
//       unsynced.map(async (hash: Hash) => {
//         const transaction = await database.collections
//           .get('transactions')
//           .find(hash.transactionId);
//         return {
//           ...transaction._raw,
//           account: JSON.parse(transaction.account),
//           category: JSON.parse(transaction.category),
//         };
//       }),
//     );

//     return transactions;
//   } catch (error) {
//     console.error('Error fetching unsynced transactions:', error);
//     return [];
//   }
// };
