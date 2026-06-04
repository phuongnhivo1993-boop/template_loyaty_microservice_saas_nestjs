import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty() @IsString() tenantId: string;
  @ApiProperty({ enum: ['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'] })
  plan: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() autoRenew?: boolean;
}

export class UpdateSubscriptionDto {
  @ApiProperty({ required: false, enum: ['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'] })
  @IsOptional() plan?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() autoRenew?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() maxMembers?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() maxCampaigns?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() maxRewards?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() maxTiers?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() maxVouchers?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() maxStores?: number;
  @ApiProperty({ required: false }) @IsOptional() features?: Record<string, boolean>;
}

export class SubscriptionQueryDto {
  @ApiProperty({ required: false, default: 1 }) @IsOptional() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() plan?: string;
}
