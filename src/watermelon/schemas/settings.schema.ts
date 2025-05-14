import {tableSchema} from '@nozbe/watermelondb/Schema';
export const settingsSchema = tableSchema({
  name: 'settings',
  columns: [
    {name: 'is_sync_feature_enabled', type: 'boolean'},
    {name: 'last_sync_date', type: 'string'},
  ],
});
