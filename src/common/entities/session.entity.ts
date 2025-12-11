import crypto from 'node:crypto';
import { Session } from '../types/model.types';
import UserEntity from './user.entity';

export default class SessionEntity implements Session {
  constructor(
    private readonly _id: string,
    private _userId: string,
    private _secret: string,
    private _createdAt: Date,
    private _User?: UserEntity,
  ) {}

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get secret(): string {
    return this._secret;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get User(): UserEntity | undefined {
    return this._User;
  }

  static new(user: UserEntity) {
    return new SessionEntity(
      crypto.randomUUID(),
      user.id,
      crypto.randomBytes(6).toString('hex'),
      new Date(),
    );
  }

  static fromDatabase(data: Session): SessionEntity {
    return new SessionEntity(
      data.id,
      data.userId,
      data.secret,
      new Date(data.createdAt),
      data.User ? UserEntity.fromDatabase(data.User) : undefined,
    );
  }

  toObject(): Session {
    return {
      id: this.id,
      userId: this.userId,
      secret: this.secret,
      createdAt: this.createdAt,
      User: this.User ? this.User.toObject() : undefined,
    };
  }
}
