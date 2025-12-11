import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
