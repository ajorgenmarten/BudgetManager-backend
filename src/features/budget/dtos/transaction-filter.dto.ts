import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TransactionType } from 'src/common/types/model.types';

export default class TransactionFilterDto {
  @ApiProperty({ enum: TransactionType, required: false })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType | null;
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  page?: number | null;
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  search?: string | undefined;
  @ApiProperty({ type: Date, required: false })
  @IsOptional()
  @IsDate()
  startDate?: Date | null;
  @ApiProperty({ type: Date, required: false })
  @IsOptional()
  @IsDate()
  endDate?: Date | null;
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  maxAmount?: number | null;
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  minAmount?: number | null;
}
