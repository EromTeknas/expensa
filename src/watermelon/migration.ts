import {
  schemaMigrations,
  createTable,
} from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'hashes',
          columns: [
            {name: 'hash', type: 'string', isIndexed: true}, // Unique hash of the transaction message
            {name: 'is_synced', type: 'boolean', isOptional: true}, // Whether the transaction is synced
            {name: 'transaction_id', type: 'number', isIndexed: true}, // Foreign key reference to transactions
          ],
        }),
        createTable({
          name: 'hashes',
          columns: [
            {name: 'hash', type: 'string', isIndexed: true}, // Unique hash of the transaction message
            {name: 'is_synced', type: 'boolean', isOptional: true}, // Whether the transaction is synced
            {name: 'transaction_id', type: 'number', isIndexed: true}, // Foreign key reference to transactions
          ],
        }),
        createTable({
          name: 'transactions',
          columns: [
            {name: 'amount', type: 'number'},
            {name: 'description', type: 'string', isOptional: true},
            {name: 'transaction_time', type: 'string'}, // UTC format
            {name: 'type', type: 'string'}, // Transaction type (enum as string)
            {name: 'user_id', type: 'string'},
            {name: 'account', type: 'string'}, // JSON string for account object
            {name: 'category', type: 'string'}, // JSON string for category object
          ],
        }),
      ],
    },
  ],
});
