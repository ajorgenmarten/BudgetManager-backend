import { PendingItem } from '../types/model.types';
import UserEntity from './user.entity';

export default class PendingItemEntity implements PendingItem {
  constructor(
    private readonly _id: string,
    private _userId: string,
    private _content: string,
    private _status: boolean,
    private _createdAt: Date,
    private _User?: UserEntity,
  ) {}

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get content(): string {
    return this._content;
  }

  get status(): boolean {
    return this._status;
  }

  set status(value: boolean) {
    this._status = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get User(): UserEntity | undefined {
    return this._User;
  }

  static new(user: UserEntity, content: string) {
    return new PendingItemEntity(
      crypto.randomUUID(),
      user.id,
      content,
      false,
      new Date(),
    );
  }

  static fromDatabase(pendingItem: PendingItem) {
    return new PendingItemEntity(
      pendingItem.id,
      pendingItem.userId,
      pendingItem.content,
      pendingItem.status,
      pendingItem.createdAt,
      pendingItem.User ? UserEntity.fromDatabase(pendingItem.User) : undefined,
    );
  }

  toObject(): PendingItem {
    return {
      id: this.id,
      userId: this.userId,
      content: this.content,
      status: this.status,
      createdAt: this.createdAt,
      User: this.User ? this.User.toObject() : undefined,
    };
  }
}
