import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCashbackConfigDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) rate: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) @Type(() => Number) minAmount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) @Type(() => Number) maxAmount?: number;
  @ApiProperty() @IsString() tenantId: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) @Type(() => Number) minPointsBalance?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() startDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() endDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

export class UpdateCashbackConfigDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) @Type(() => Number) rate?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) @Type(() => Number) minAmount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) @Type(() => Number) maxAmount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) @Type(() => Number) minPointsBalance?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() startDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() endDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

export class EarnCashbackDto {
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) amount: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() referenceId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
}

export class RedeemCashbackDto {
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) amount: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() referenceId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
}
