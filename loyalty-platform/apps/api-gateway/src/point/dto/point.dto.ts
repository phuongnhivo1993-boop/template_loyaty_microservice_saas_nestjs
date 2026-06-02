import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EarnPointsDto {
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty() @IsNumber() @Min(1) amount: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() reason?: string;
}

export class BurnPointsDto {
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty() @IsNumber() @Min(1) amount: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() reason?: string;
}

export class AdjustPointsDto {
  @ApiProperty() @IsString() memberId: string;
  @ApiProperty() @IsNumber() amount: number;
  @ApiProperty() @IsString() reason: string;
}

export class PointTransactionQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() memberId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tenantId?: string;
  @ApiProperty({ required: false, default: 1 }) @IsOptional() page?: number;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() limit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() type?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() search?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sort?: string;
}
