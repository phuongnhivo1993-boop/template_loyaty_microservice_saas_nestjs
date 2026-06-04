import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGiftCardDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  initialValue: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  balance?: number;

  @ApiProperty({ required: false, enum: ['physical', 'digital'] })
  @IsOptional()
  @IsEnum(['physical', 'digital'])
  type?: 'physical' | 'digital';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class UpdateGiftCardDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  initialValue?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  balance?: number;

  @ApiProperty({ required: false, enum: ['physical', 'digital'] })
  @IsOptional()
  @IsEnum(['physical', 'digital'])
  type?: 'physical' | 'digital';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class AssignGiftCardDto {
  @ApiProperty()
  @IsString()
  memberId: string;
}

export class RedeemGiftCardDto {
  @ApiProperty()
  @IsString()
  memberId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;
}
