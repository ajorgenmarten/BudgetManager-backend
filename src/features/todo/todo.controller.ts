import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import UserEntity from 'src/common/entities/user.entity';
import TodoService from './services/todo.service';
import { type Request } from 'express';
import JwtAccessGuard from '../auth/guards/jwt-access.guard';
import { CreateTodoDto } from './dtos/create-todo.dto';
import ParamIdDto from './dtos/param-id.dto';

@UseGuards(JwtAccessGuard)
@Controller('todo')
export default class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('create')
  create(@Req() req: Request, @Body() body: CreateTodoDto) {
    return this.todoService.create(req.user as UserEntity, body.content);
  }

  @Delete('delete/:id')
  async delete(@Param() params: ParamIdDto) {
    return this.todoService.delete(params.id);
  }

  @Get('confirm/:id')
  async confirm(@Param() params: ParamIdDto) {
    return this.todoService.toggle(params.id, true);
  }

  @Get('unconfirm/:id')
  async unconfirm(@Param() params: ParamIdDto) {
    return this.todoService.toggle(params.id, false);
  }
}
