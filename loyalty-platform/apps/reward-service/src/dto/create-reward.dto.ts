import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsEnum } from 'class-validator';

export enum RewardType {
  VOUCHER = 'voucher',
  GIFT = 'gift',
  CASHBACK = 'cashback',
  COUPON = 'coupon',
}

export class CreateRewardDto {
  @ApiProperty({ description: 'Reward name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Reward description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: RewardType, description: 'Type of reward' })
  @IsEnum(RewardType)
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Points required to redeem' })
  @IsInt()
  @Min(1)
  pointsRequired: number;

  @ApiPropertyOptional({ description: 'Available quantity', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Image URL' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;
}
