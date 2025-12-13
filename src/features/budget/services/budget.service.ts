import { Injectable, NotFoundException } from '@nestjs/common';
import AddTransactionDto from '../dtos/add-transaction.dto';
import UserEntity from 'src/common/entities/user.entity';
import BudgetRepository from '../repositories/budget.repository';
import TransactionEntity from 'src/common/entities/transaction.entity';
import { TransactionType } from 'src/common/types/model.types';
import TransactionFilterDto from '../dtos/transaction-filter.dto';

@Injectable()
export default class BudgetService {
  constructor(private readonly budgetRepository: BudgetRepository) {}

  async addTransaction(user: UserEntity, transaction: AddTransactionDto) {
    const incomingTransaction = TransactionEntity.new(
      user,
      transaction.type,
      transaction.amount,
      transaction.category,
      transaction.description ? transaction.description : null,
    );

    const userBudget = await this.budgetRepository.findUserBudgetById(
      user.budgetId,
    );

    if (!userBudget) throw new NotFoundException('User budget not found');

    if (incomingTransaction.type === TransactionType.INCOME)
      userBudget.amount += incomingTransaction.amount;

    if (incomingTransaction.type === TransactionType.EXPENSE)
      userBudget.amount -= incomingTransaction.amount;

    await this.budgetRepository.registerTransaction(
      userBudget,
      incomingTransaction,
    );

    return {
      budget: userBudget.toObject(),
      transaction: incomingTransaction.toObject(),
    };
  }

  async getTotalUserExpenses(user: UserEntity) {
    return await this.budgetRepository.findAllExpenses(user.id);
  }

  async getTotalUserIncomes(user: UserEntity) {
    return await this.budgetRepository.findAllIncomes(user.id);
  }

  async getUserBudget(user: UserEntity) {
    const userBudget = await this.budgetRepository.findUserBudgetById(
      user.budgetId,
    );

    if (!userBudget) throw new NotFoundException('User budget not found');

    return userBudget.toObject();
  }

  async transactions(
    user: UserEntity,
    transactionFilter: TransactionFilterDto,
  ) {
    return await this.budgetRepository.findTransactions(
      user.id,
      transactionFilter,
    );
  }
}
