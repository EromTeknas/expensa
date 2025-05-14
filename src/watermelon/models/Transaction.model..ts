import {Model} from '@nozbe/watermelondb';
import {field, json} from '@nozbe/watermelondb/decorators';

export default class Transaction extends Model {
  static table = 'transactions';

  @field('amount') amount!: number;
  @field('created_at') createdAt!: string;
  @field('description') description!: string | null;
  @field('transaction_time') transactionTime!: string;
  @field('type') type!: string;
  @field('updated_at') updatedAt!: string | null;
  @field('user_id') userId!: string;

  @json('account', raw => raw) account!: object;
  @json('category', raw => raw) category!: object;
}
