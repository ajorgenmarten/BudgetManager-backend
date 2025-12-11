import { Budget, User } from '../types/model.types';
import UserEntity from './user.entity';

export default class BudgetEntity implements Budget {
  constructor(
    private readonly _id: string,
    private _name: string,
    private _amount: number,
    private _createdAt: Date,
    private _User?: UserEntity[],
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get amount(): number {
    return this._amount;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get User(): UserEntity[] | undefined {
    return this._User;
  }

  static new(name: string = 'Mi presupuesto') {
    return new BudgetEntity(crypto.randomUUID(), name, 0, new Date());
  }

  static fromDatabase(budget: Budget) {
    return new BudgetEntity(
      budget.id,
      budget.name,
      budget.amount,
      budget.createdAt,
      budget.User
        ? budget.User.map((user) => UserEntity.fromDatabase(user))
        : undefined,
    );
  }

  toObject(): Budget {
    return {
      id: this.id,
      name: this.name,
      amount: this.amount,
      createdAt: this.createdAt,
      User: this.User ? this.User.map((user) => user.toObject()) : undefined,
    };
  }
}
