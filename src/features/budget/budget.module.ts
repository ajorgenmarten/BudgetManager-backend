import { Module } from '@nestjs/common';
import BudgetController from './budget.controller';
import BudgetRepository from './repositories/budget.repository';
import BudgetService from './services/budget.service';

@Module({
  providers: [BudgetRepository, BudgetService],
  controllers: [BudgetController],
})
export default class BudgetModule {}
