import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum RewardType {
  VOUCHER = 'voucher',
  GIFT = 'gift',
  DISCOUNT = 'discount',
}

export class CreatePartnerBrandDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() code: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() logo?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() website?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() contactEmail?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() contactPhone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) @Type(() => Number) commissionRate?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty() @IsString() tenantId: string;
}

export class UpdatePartnerBrandDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() code?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() logo?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() website?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() contactEmail?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() contactPhone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) @Type(() => Number) commissionRate?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

export class CreatePartnerRewardDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() brandId?: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ enum: RewardType }) @IsEnum(RewardType) type: RewardType;
  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) value: number;
  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) pointsRequired: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) @Type(() => Number) quantity?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() imageUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() startDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() endDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

export class UpdatePartnerRewardDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false, enum: RewardType }) @IsOptional() @IsEnum(RewardType) type?: RewardType;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) @Type(() => Number) value?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) @Type(() => Number) pointsRequired?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0) @Type(() => Number) quantity?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() imageUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() startDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() endDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

export class RedeemPartnerRewardDto {
  @ApiProperty() @IsString() rewardId: string;
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() @IsNumber() @Min(1) @Type(() => Number) quantity?: number;
}
