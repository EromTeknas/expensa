import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';
import {TransactionType} from 'src/models/transactions';

export default class Transaction extends Model {
  static table = 'transactions';
  @field('hash') hash!: string;
  @field('is_synced') isSynced!: boolean;
  @field('bank_name') bankName!: string;
  @field('type') type!: TransactionType;
  @field('amount') amount!: number;
  @field('description') description!: string | null;
  @field('transaction_time') transactionTime!: number;
  @field('party') party!: string;
  @field('created_at') createdAt!: number;
  @field('updated_at') updatedAt!: number;
  @field('category_id') categoryId!: string;
  @field('account_id') accountId!: string;

  // @field('user_id') userId!: string;

  // @json('account', raw => raw) account!: object;
  // @json('category', raw => raw) category!: object;
}
