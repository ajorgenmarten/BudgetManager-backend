import bcrypt, { hashSync } from 'bcrypt';
import { User } from '../types/model.types';
import BudgetEntity from './budget.entity';
import PendingItemEntity from './pending-item.entity';
import TransactionEntity from './transaction.entity';
import SessionEntity from './session.entity';

type PublicUserData = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
};

export default class UserEntity implements User {
  constructor(
    private readonly _id: string,
    private _name: string,
    private _email: string,
    private _password: string,
    private _budgetId: string,
    private _emailVerified: boolean,
    private _transactions?: TransactionEntity[],
    private _pendings?: PendingItemEntity[],
    private _budget?: BudgetEntity,
    private _sessions?: SessionEntity[],
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get emailVerified(): boolean {
    return this._emailVerified;
  }

  set emailVerified(value: boolean) {
    this._emailVerified = value;
  }

  get budgetId(): string {
    return this._budgetId;
  }

  get Transactions(): TransactionEntity[] | undefined {
    return this._transactions;
  }

  get Pendings(): PendingItemEntity[] | undefined {
    return this._pendings;
  }

  get Budget(): BudgetEntity | undefined {
    return this._budget;
  }

  get Sessions(): SessionEntity[] | undefined {
    return this._sessions;
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this._password);
  }

  static new(name: string, email: string, password: string) {
    const budget = BudgetEntity.new();
    return new UserEntity(
      crypto.randomUUID(),
      name,
      email,
      hashSync(password, 12),
      budget.id,
      false,
      [],
      [],
      budget,
      [],
    );
  }

  static fromDatabase(user: User): UserEntity {
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.password,
      user.budgetId,
      user.emailVerified,
      user.Transactions
        ? user.Transactions.map((transaction) =>
            TransactionEntity.fromDatabase(transaction),
          )
        : undefined,
      user.Pendings
        ? user.Pendings.map((pending) =>
            PendingItemEntity.fromDatabase(pending),
          )
        : undefined,
      user.Budget ? BudgetEntity.fromDatabase(user.Budget) : undefined,
      user.Sessions
        ? user.Sessions.map((session) => SessionEntity.fromDatabase(session))
        : undefined,
    );
  }

  toObject(): User {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      emailVerified: this.emailVerified,
      budgetId: this.budgetId,
      Transactions: this.Transactions
        ? this.Transactions.map((transaction) => transaction.toObject())
        : undefined,
      Pendings: this.Pendings
        ? this.Pendings.map((pending) => pending.toObject())
        : undefined,
      Budget: this.Budget ? this.Budget.toObject() : undefined,
      Sessions: this.Sessions
        ? this.Sessions.map((session) => session.toObject())
        : undefined,
    };
  }

  toDomain(): PublicUserData {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      emailVerified: this.emailVerified,
    };
  }
}
