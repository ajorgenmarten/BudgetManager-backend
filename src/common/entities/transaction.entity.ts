import { Transaction, TransactionType } from '../types/model.types';
import UserEntity from './user.entity';

export default class TransactionEntity implements Transaction {
  constructor(
    private readonly _id: string,
    private _userId: string,
    private _amount: number,
    private _type: TransactionType,
    private _category: string,
    private _description: string | null,
    private _createdAt: Date,
    private _User?: UserEntity,
  ) {}

  get User(): UserEntity | undefined {
    return this._User;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get amount(): number {
    return this._amount;
  }

  get type(): TransactionType {
    return this._type;
  }

  get category(): string {
    return this._category;
  }

  get description(): string | null {
    return this._description;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  static fromDatabase(transaction: Transaction) {
    return new TransactionEntity(
      transaction.id,
      transaction.userId,
      transaction.amount,
      transaction.type,
      transaction.category,
      transaction.description,
      transaction.createdAt,
      transaction.User ? UserEntity.fromDatabase(transaction.User) : undefined,
    );
  }

  toObject(): Transaction {
    return {
      id: this.id,
      userId: this.userId,
      amount: this.amount,
      type: this.type,
      category: this.category,
      description: this.description,
      createdAt: this.createdAt,
      User: this.User ? this.User.toObject() : undefined,
    };
  }
}
