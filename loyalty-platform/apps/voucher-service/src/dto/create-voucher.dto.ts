import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export enum VoucherType {
  DISCOUNT = 'discount',
  CASHBACK = 'cashback',
  GIFT = 'gift',
}

export class CreateVoucherDto {
  @ApiPropertyOptional({ description: 'Voucher code (auto-generated if omitted)' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ enum: VoucherType, description: 'Type of voucher' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Monetary value of the voucher' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  value: number;

  @ApiPropertyOptional({ description: 'Maximum number of uses' })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxUsage?: number;

  @ApiPropertyOptional({ description: 'Expiration date (ISO string)' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;
}
