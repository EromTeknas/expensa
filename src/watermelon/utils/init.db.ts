// src/database/initDB.ts
import {database} from '../database';
import {Q} from '@nozbe/watermelondb';
import {subWeeks, startOfWeek} from 'date-fns';

export const initializeDatabase = async () => {
  try {
    await database.write(async () => {
      // Check if settings already exist
      const existingSettings = await database.collections
        .get('settings')
        .query(Q.where('is_sync_feature_enabled', Q.notEq(null)))
        .fetch();

      if (existingSettings.length === 0) {
        // Set the last sync date to the start of the previous week in UTC
        const lastSyncDate = startOfWeek(subWeeks(new Date(), 1)).toISOString();

        await database.collections.get('settings').create((record: any) => {
          record.isSyncFeatureEnabled = false; // Default to false
          record.lastSyncDate = lastSyncDate;
        });

        console.log('Database initialized with default settings.');
      } else {
        console.log('Database already initialized.');
      }
    });
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
