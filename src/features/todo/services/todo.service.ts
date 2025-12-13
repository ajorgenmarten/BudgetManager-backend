import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import UserEntity from 'src/common/entities/user.entity';
import TodoRepository from '../repositories/todo.repository';
import PendingItemEntity from 'src/common/entities/pending-item.entity';

@Injectable()
export default class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  private async ensureIsMyResource(user: UserEntity, resourceId: string) {
    const resource = await this.todoRepository.findPendingItemById(resourceId);

    if (!resource) throw new NotFoundException('Pending item not found');

    if (resource.userId !== user.id)
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );

    return resource;
  }

  async create(user: UserEntity, content: string) {
    const pendingItem = PendingItemEntity.new(user, content);
    await this.todoRepository.createPendingItem(pendingItem);
    return pendingItem.toObject();
  }

  async delete(user: UserEntity, id: string) {
    const pendingItem = await this.ensureIsMyResource(user, id);
    await this.todoRepository.deletePendingItem(pendingItem.id);
    return { message: 'Pending item deleted successfully' };
  }

  async toggle(user: UserEntity, id: string, value: boolean) {
    const pendingItem = await this.ensureIsMyResource(user, id);
    if (pendingItem.status === value) return pendingItem;
    pendingItem.status = value;
    await this.todoRepository.updatePendingItem(pendingItem);
    return pendingItem.toObject();
  }
}
