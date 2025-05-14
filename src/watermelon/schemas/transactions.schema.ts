import {tableSchema} from '@nozbe/watermelondb/Schema';
export const transactionsSchema = tableSchema({
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
});
