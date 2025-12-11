import { Module } from '@nestjs/common';
import TodoService from './services/todo.service';
import TodoRepository from './repositories/todo.repository';
import TodoController from './todo.controller';

@Module({
  providers: [TodoService, TodoRepository],
  controllers: [TodoController],
})
export default class TodoModule {}
