import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRewardDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() type: string;
  @ApiProperty() @IsNumber() pointsRequired: number;
  @ApiProperty() @IsNumber() quantity: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() imageUrl?: string;
  @ApiProperty() @IsString() tenantId: string;
}

export class UpdateRewardDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() pointsRequired?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() quantity?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() imageUrl?: string;
}

export class RedeemRewardDto {
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() quantity?: number;
}

export class RewardQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sort?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() type?: string;
}
