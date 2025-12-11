import { Injectable, NotFoundException } from '@nestjs/common';
import UserEntity from 'src/common/entities/user.entity';
import TodoRepository from '../repositories/todo.repository';
import PendingItemEntity from 'src/common/entities/pending-item.entity';

@Injectable()
export default class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async create(user: UserEntity, content: string) {
    const pendingItem = PendingItemEntity.new(user, content);
    await this.todoRepository.createPendingItem(pendingItem);
    return pendingItem;
  }

  async delete(id: string) {
    await this.todoRepository.deletePendingItem(id);
    return { message: 'Pending item deleted successfully' };
  }

  async toggle(id: string, value: boolean) {
    const pendingItem = await this.todoRepository.findPendingItemById(id);
    if (!pendingItem) throw new NotFoundException('Pending item not found');
    if (pendingItem.status === value) return pendingItem;
    pendingItem.status = value;
    await this.todoRepository.updatePendingItem(pendingItem);
    return pendingItem;
  }
}
