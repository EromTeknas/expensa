import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {appSchema} from '@nozbe/watermelondb';
import Transaction from './models/Transaction.model.';
import Settings from './models/Settings.model';
import {transactionsSchema} from './schemas/transactions.schema';
import {settingsSchema} from './schemas/settings.schema';
import {migrations} from './migration';

const adapter = new SQLiteAdapter({
  schema: appSchema({
    version: 2,
    tables: [transactionsSchema, settingsSchema],
  }),
  migrations,
  jsi: false,
});

export const database = new Database({
  adapter,
  modelClasses: [Transaction, Settings],
});
