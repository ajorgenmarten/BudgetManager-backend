import { Injectable } from '@nestjs/common';
import BudgetEntity from 'src/common/entities/budget.entity';
import TransactionEntity from 'src/common/entities/transaction.entity';
import PrismaService from 'src/common/modules/prisma/prisma.service';
import { TransactionType } from 'src/common/types/model.types';
import TransactionFilterDto from '../dtos/transaction-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export default class BudgetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserBudgetById(budgetId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id: budgetId },
    });

    if (!budget) return null;

    return BudgetEntity.fromDatabase(budget);
  }

  async registerTransaction(
    userBudget: BudgetEntity,
    transcation: TransactionEntity,
  ) {
    await this.prisma.$transaction(async (trx) => {
      await trx.transaction.create({
        data: {
          id: transcation.id,
          amount: transcation.amount,
          category: transcation.category,
          type: transcation.type,
          description: transcation.description,
          userId: transcation.userId,
          createdAt: transcation.createdAt,
        },
      });

      await trx.budget.update({
        where: { id: userBudget.id },
        data: { amount: userBudget.amount, name: userBudget.name },
      });
    });
  }

  async findAllIncomes(userId: string) {
    const result = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: TransactionType.INCOME },
    });

    return result._sum.amount;
  }

  async findAllExpenses(userId: string) {
    const result = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: TransactionType.EXPENSE },
    });

    return result._sum.amount;
  }

  async findTransactions(userId: string, filters: TransactionFilterDto) {
    const where: Prisma.TransactionWhereInput = { userId };

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};

      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }

      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    if (
      typeof filters.minAmount === 'number' ||
      typeof filters.maxAmount === 'number'
    ) {
      where.amount = {};

      if (filters.minAmount) {
        where.amount.gte = filters.minAmount;
      }

      if (filters.maxAmount) {
        where.amount.lte = filters.maxAmount;
      }
    }

    if (typeof filters.type === 'string') {
      where.type = filters.type;
    }

    if (filters.search) {
      where.description = {};
      where.category = {};
      where.description.contains = filters.search;
      where.description.mode = 'insensitive';
      where.category.contains = filters.search;
      where.category.mode = 'insensitive';
    }

    const itemsCount = 50;
    const page = filters.page || 0;
    const totalItems = await this.prisma.transaction.count({ where });
    const totalPages = Math.ceil(totalItems / itemsCount);

    const results = await this.prisma.transaction.findMany({
      where,
      skip: page * itemsCount,
      take: itemsCount,
      orderBy: { createdAt: 'desc' },
    });

    return { results, totalItems, totalPages, page, pageSize: results.length };
  }
}
