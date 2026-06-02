import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEarningRuleDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ default: 1.0 }) @IsOptional() @IsNumber() @Type(() => Number) pointsPerUnit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Type(() => Number) minAmount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Type(() => Number) maxAmount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() category?: string;
  @ApiProperty() @IsString() tenantId: string;
}

export class UpdateEarningRuleDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Type(() => Number) pointsPerUnit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Type(() => Number) minAmount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Type(() => Number) maxAmount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() category?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

export class EarningRuleQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() @Type(() => Number) page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() @Type(() => Number) limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() category?: string;
}
