import {tableSchema} from '@nozbe/watermelondb/Schema';

export const hashesSchema = tableSchema({
  name: 'hashes',
  columns: [
    {name: 'hash', type: 'string', isIndexed: true}, // Unique hash of the transaction message
    {name: 'is_synced', type: 'boolean', isOptional: true}, // Whether the transaction is synced
    {name: 'transaction_id', type: 'number', isIndexed: true}, // Foreign key reference to transactions
  ],
});
