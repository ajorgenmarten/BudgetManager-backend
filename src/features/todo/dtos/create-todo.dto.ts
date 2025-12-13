import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
