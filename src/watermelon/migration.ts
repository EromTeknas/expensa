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
          name: 'settings',
          columns: [
            {name: 'is_sync_feature_enabled', type: 'boolean'},
            {name: 'last_sync_date', type: 'number'},
          ],
        }),
        createTable({
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
        }),
      ],
    },
  ],
});
