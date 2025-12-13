import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import UserEntity from 'src/common/entities/user.entity';
import AddTransactionDto from './dtos/add-transaction.dto';
import { type Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import BudgetService from './services/budget.service';
import JwtAccessGuard from '../auth/guards/jwt-access.guard';
import TransactionFilterDto from './dtos/transaction-filter.dto';

@ApiTags('Manejo de presupuesto')
@UseGuards(JwtAccessGuard)
@Controller('budget')
export default class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('transaction')
  addTransaction(@Req() req: Request, @Body() body: AddTransactionDto) {
    return this.budgetService.addTransaction(req.user as UserEntity, body);
  }

  @Get('info')
  async getBudgetInfo(@Req() req: Request): Promise<any> {
    const [budget, totalExpenses, totalIncomes] = await Promise.all([
      this.budgetService.getUserBudget(req.user as UserEntity),
      this.budgetService.getTotalUserExpenses(req.user as UserEntity),
      this.budgetService.getTotalUserIncomes(req.user as UserEntity),
    ]);

    return {
      budget,
      totalIncomes,
      totalExpenses,
    };
  }

  @Get('transactions')
  async getTransactions(
    @Req() req: Request,
    @Query() query: TransactionFilterDto,
  ) {
    return this.budgetService.transactions(req.user as UserEntity, query);
  }
}
