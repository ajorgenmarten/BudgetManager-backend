import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  password: string;
}
