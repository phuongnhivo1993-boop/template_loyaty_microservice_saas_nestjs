import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVoucherDto {
  @ApiProperty() @IsString() code: string;
  @ApiProperty() @IsString() type: string;
  @ApiProperty() @IsNumber() value: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() maxUsage?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() expiresAt?: string;
  @ApiProperty() @IsString() tenantId: string;
}

export class UpdateVoucherDto {
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() value?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() maxUsage?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() expiresAt?: string;
}

export class ValidateVoucherDto {
  @ApiProperty() @IsString() code: string;
}

export class VoucherQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() @Type(() => Number) page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() @Type(() => Number) limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sort?: string;
}

export class BatchGenerateVoucherDto {
  @ApiProperty() @IsString() prefix: string;
  @ApiProperty() @IsNumber() @Min(1) @Type(() => Number) count: number;
  @ApiProperty() @IsString() type: string;
  @ApiProperty() @IsNumber() @Type(() => Number) value: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() maxUsage?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() expiresAt?: string;
  @ApiProperty() @IsString() tenantId: string;
}
