import {tableSchema} from '@nozbe/watermelondb';

export const transactionsSchema = tableSchema({
  name: 'transactions',
  columns: [
    {name: 'hash', type: 'string', isIndexed: true}, // required
    {name: 'is_synced', type: 'boolean'}, // required
    {name: 'transaction_time', type: 'number'}, // required (ISO string)
    {name: 'created_at', type: 'number'},
    {name: 'updated_at', type: 'number'},

    // Optional fields:
    {name: 'bank_name', type: 'string', isOptional: true},
    {name: 'type', type: 'string', isOptional: true},
    {name: 'amount', type: 'number', isOptional: true},
    {name: 'description', type: 'string', isOptional: true},
    {name: 'party', type: 'string', isOptional: true},
    {name: 'category_id', type: 'string', isOptional: true},
    {name: 'account_id', type: 'string', isOptional: true},
  ],
});
