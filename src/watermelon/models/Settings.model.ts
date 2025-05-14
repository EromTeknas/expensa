// src/database/models/Settings.model.ts
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

export default class Settings extends Model {
  static table = 'settings';

  @field('is_sync_feature_enabled') isSyncFeatureEnabled!: boolean;
  @field('last_sync_date') lastSyncDate!: string;
}
