import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class BatchGenerateDto {
  @ApiProperty({ description: 'Type of vouchers to generate' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Monetary value of each voucher' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  value: number;

  @ApiProperty({ description: 'Number of vouchers to generate' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  count: number;

  @ApiPropertyOptional({ description: 'Expiration date (ISO string)' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;
}
