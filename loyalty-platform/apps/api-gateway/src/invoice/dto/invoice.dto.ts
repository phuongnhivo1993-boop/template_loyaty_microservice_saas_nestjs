import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export class CreateInvoiceDto {
  @ApiProperty() @IsString() subscriptionId: string;
  @ApiProperty() @IsNumber() @Type(() => Number) amount: number;
  @ApiProperty({ default: 'VND' }) @IsOptional() @IsString() currency?: string;
  @ApiProperty() @IsDateString() dueDate: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() metadata?: Record<string, any>;
}

export class UpdateInvoiceDto {
  @ApiProperty({ enum: InvoiceStatus }) @IsEnum(InvoiceStatus) status: InvoiceStatus;
  @ApiProperty({ required: false }) @IsOptional() @IsString() paymentMethod?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() paidAt?: string;
  @ApiProperty({ required: false }) @IsOptional() metadata?: Record<string, any>;
}

export class InvoiceQueryDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsNumber() page?: number;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subscriptionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tenantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}
