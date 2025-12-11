import { Injectable } from '@nestjs/common';
import SessionEntity from 'src/common/entities/session.entity';
import UserEntity from 'src/common/entities/user.entity';
import PrismaService from 'src/common/modules/prisma/prisma.service';

@Injectable()
export default class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) return null;

    return UserEntity.fromDatabase(user);
  }

  async updateUser(user: UserEntity) {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        budgetId: user.budgetId,
        emailVerified: user.emailVerified,
      },
    });
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) return null;

    return UserEntity.fromDatabase(user);
  }

  async registerUser(user: UserEntity) {
    const budget = user.Budget;
    if (!budget) throw new Error('Cant not create budget for user!');

    await this.prisma.$transaction(async (trx) => {
      await trx.budget.create({
        data: {
          id: budget.id,
          name: budget.name,
          amount: budget.amount,
          createdAt: budget.createdAt,
        },
      });
      await trx.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          budgetId: user.budgetId,
          emailVerified: user.emailVerified,
        },
      });
    });
  }

  async createSession(session: SessionEntity): Promise<void> {
    await this.prisma.session.create({
      data: {
        id: session.id,
        userId: session.userId,
        secret: session.secret,
        createdAt: session.createdAt,
      },
    });
  }

  async findSessionById(id: string): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findFirst({
      where: { id },
    });

    if (!session) return null;

    return SessionEntity.fromDatabase(session);
  }
}
