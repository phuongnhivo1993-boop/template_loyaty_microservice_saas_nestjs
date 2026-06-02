import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ required: false, default: 1 }) @IsOptional() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sort?: string;
}
