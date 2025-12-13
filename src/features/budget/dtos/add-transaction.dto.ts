import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TransactionType } from 'src/common/types/model.types';

export default class AddTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: string;
  @ApiProperty({ enum: TransactionType })
  @IsString()
  @IsEnum(TransactionType)
  type: TransactionType;
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  description?: string | null;
}
