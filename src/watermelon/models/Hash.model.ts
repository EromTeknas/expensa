import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

export default class Hash extends Model {
  static table = 'hashes';

  @field('hash') hash!: string;
  @field('is_synced') isSynced!: boolean;
  @field('transaction_id') transactionId!: string;
  @field('created_at') createdAt!: string;
}
