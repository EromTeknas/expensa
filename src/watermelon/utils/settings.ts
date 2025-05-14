// src/utils/settings.ts
import {database} from '../database';


export const saveSyncSettings = async (
  isSyncFeatureEnabled: boolean,
  lastSyncDate: string,
) => {
  try {
    await database.write(async () => {
      const settingsCollection = database.collections.get('settings');
      const existingSettings = await settingsCollection.query().fetch();

      if (existingSettings.length > 0) {
        const settings = existingSettings[0];
        await settings.update((record: any) => {
          record.isSyncFeatureEnabled = isSyncFeatureEnabled;
          record.lastSyncDate = lastSyncDate;
        });
      } else {
        await settingsCollection.create((record: any) => {
          record.isSyncFeatureEnabled = isSyncFeatureEnabled;
          record.lastSyncDate = lastSyncDate;
        });
      }
    });
    console.log('Sync settings saved successfully!');
  } catch (error) {
    console.error('Error saving sync settings:', error);
  }
};

export const getSyncSettings = async () => {
  try {
    const settingsCollection = database.collections.get('settings');
    const settings = await settingsCollection.query().fetch();

    if (settings.length > 0) {
      return settings[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching sync settings:', error);
    return null;
  }
};
