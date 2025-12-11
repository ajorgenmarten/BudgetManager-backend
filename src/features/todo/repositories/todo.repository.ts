import { Injectable } from '@nestjs/common';
import PendingItemEntity from 'src/common/entities/pending-item.entity';
import PrismaService from 'src/common/modules/prisma/prisma.service';

@Injectable()
export default class TodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPendingItem(pendingItem: PendingItemEntity) {
    await this.prisma.pendingItem.create({
      data: {
        id: pendingItem.id,
        content: pendingItem.content,
        status: pendingItem.status,
        userId: pendingItem.userId,
        createdAt: pendingItem.createdAt,
      },
    });
  }

  async deletePendingItem(id: string) {
    await this.prisma.pendingItem.delete({ where: { id } });
  }

  async findPendingItemById(id: string) {
    const pendingItem = await this.prisma.pendingItem.findFirst({
      where: { id },
    });

    if (!pendingItem) return null;

    return PendingItemEntity.fromDatabase(pendingItem);
  }

  async updatePendingItem(pendingItem: PendingItemEntity) {
    await this.prisma.pendingItem.update({
      where: { id: pendingItem.id },
      data: {
        userId: pendingItem.userId,
        createdAt: pendingItem.createdAt,
        content: pendingItem.content,
        status: pendingItem.status,
      },
    });
  }
}
